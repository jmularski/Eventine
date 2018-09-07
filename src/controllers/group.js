require('express-validator');
const admin = require('firebase-admin');
const Group = require('../models/group');
const User = require('../models/user');
const GroupError = require('../lib/errors/GroupError');

/** @api { post } /group/create
 *  @apiDescription Create group with given groupName that also serves as groupCode later, supports inviting people from facebook and app users
 *  @apiName groupCreate
 *  @apiGroup group
 *
 *  @apiParam (Body) {String} groupName - name of group, required parameter
 *  @apiParam (Body) {String} facebookIds - list of ids of facebook friends invited - available only when logged through social media, not required
 *  @apiParam (Body) {String} normalIds - list of ids of normal users invited - you can get ids from /user/friends
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {String} string containing id of new created group
 */

let create = async (req, res, next) => {
    req.checkBody({
        groupName: {
            notEmpty: { errorMessage: 'Missing groupName' },
        },
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new GroupError(validationErrors[0]));

    let { groupName, facebookIds, normalIds } = req.body;
    let { id, fullName } = req.token;
    let groupCode = groupName;


    // update User invitations field and create a new Group object - I should get rid of foreach, replace it with map (done)
    let newGroup = new Group();

    let normalData = await User.find({
        '_id': {
            $in: normalIds,
        },
    }).select('_id fullName notifToken').exec();

    let facebookData = await User.find({
        'facebookId': {
            $in: facebookIds,
        },
    }).select('_id fullName notifToken').exec();

    let peopleData = normalData.concat(facebookData);

    let peopleIds = peopleData.map(person => person.id);
    await User.updateMany({'_id': { $in: peopleIds }}, {$push: {invitations: {id: newGroup.id, name: groupName, invitedBy: fullName}}}).exec();

    // adding admin to groups
    await User.update({'_id': id}, {$push: {groups: {id: newGroup.id, name: groupName}}}).exec();

    let peopleSchema = [];
    peopleSchema = peopleData.map( person => {
        return {
            id: person.id,
            name: person.fullName,
            subgroup: 'invited',
        };
    });
    peopleSchema.push({
        id: id,
        name: fullName,
        subgroup: 'admin',
    });

    // adding normal people to group
    newGroup.groupCode = groupCode;
    newGroup.people = peopleSchema;
    newGroup.groupName = groupName;
    await newGroup.save();

    // send notification
    if(peopleData) {
        let notifIds = peopleData.map(person => person.notifToken);
        if(notifIds.length != 0) {
            try {
                let payload = {
                    notification: {
                        title: 'Zaproszenie do grupy!',
                        body: `Zostałeś zaproszony do grupy ${groupName}`,
                        sound: 'default',
                    },
                    data: {
                        groupName: groupName,
                        action: 'invitation',
                    },
                };

                await admin.messaging().sendToDevice(notifIds, payload);
            } catch(e) {
                console.log(e);
            }
        }
    }

    res.status(200).send(newGroup.id);
};

/** @api { post } /group/join
 *  @apiDescription Join group with a given groupName
 *  @apiName groupJoin
 *  @apiGroup group
 *
 *  @apiParam (Body) {String} groupName - name of group, required parameter
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *
 *  @apiSuccess {String} string containing id of joined group
 */

let join = async (req, res, next) => {
    let { groupName } = req.body;
    let { id, fullName } = req.token;

    let data = {
        id: id,
        name: fullName,
        subgroup: 'user',
    };

    if(!groupName) res.sendStatus(403);
    let groupUpdated = await Group.findOneAndUpdate({groupName}, { $push: { people: data }}).exec();
    await User.findOneAndUpdate({'_id': id}, { $push: { groups: { id: groupUpdated.id, name: groupUpdated.groupName }}});
    res.send(groupUpdated.id);
};

/** @api { post } /group/acceptInvitation
 *  @apiDescription Accept invitation of a group with given id
 *  @apiName groupAcceptInvitation
 *  @apiGroup group
 *
 *  @apiParam (Body) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {String} string containing id of joined group
 */

let acceptInvitation = async (req, res, next) => {
    let { id, fullName } = req.token;
    let { groupId } = req.body;

    let group = await Group.findById(groupId).exec();
    let user = await User.findById(id).exec();

    if(!group || !user) res.status(401).send();
    group.people = group.people.filter(person => {
        return person.id !== id;
    });
    group.people.push({
        id: id,
        name: fullName,
        subgroup: 'user',
    });


    user.invitations = user.invitations.filter(group => {
        return group.id !== groupId;
    });

    user.groups.push({
        id: group.id,
        name: group.groupName,
    });

    await group.save();
    await user.save();

    res.send(groupId);
};

/** @api { get } /group/subgroups/:groupId
 *  @apiDescription Get members of group with given groupId
 *  @apiName groupJoin
 *  @apiGroup group
 *
 *  @apiParam (Body) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} Some weird JSON object, structured (I guess) like this - {"people": [{id: id,
        name: fullName,
        subgroup: subgroup}]}
 */

// concerned about this route, why is it even named subgroups
// TODO: rename this route to members!
let subgroups = async (req, res, next) => {
    let { groupId } = req.params;
    let groupMembers = await Group.findById(groupId).select('-_id people').exec();

    res.send(groupMembers);
};

// is it even used? ASK PROGRAMMERS, THEN DELETE
let allSubgroups = async ( req, res, next ) => {
    let { groupId } = req.params;
    let groupMembers = await Group.findById(groupId).select('-_id people').exec();
    console.log(groupMembers);
    const unique = [...new Set(groupMembers.people.map(item => item.subgroup))];

    res.send(unique);
};


/** @api { post } /group/changeSubgroup
 *  @apiDescription Change subgroup of given member of given group.
 *  @apiName groupChangeSubgroup
 *  @apiGroup group
 *
 *  @apiParam (Body) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Body) {String} changingId - id of person, that you want to change groups
 *  @apiParam (Body) {String} changedSubgroup - name of subgroup you want to move person to
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Int} Only 200
 */

let changeSubgroup = async (req, res, next) => {
    let { changingId, groupId, changedSubgroup } = req.body;
    let { id } = req.token;

    let group = await Group.findById(groupId).exec();
    let user = group.people.find(person => {
        if(person.id === id) return person;
    });
    let userSubgroup = user.subgroup;
    if(userSubgroup !== 'admin') res.sendStatus(403);
    else {
        group.people.find(person => {
            if(person.id == changingId) return person;
        }).subgroup = changedSubgroup;
        group.markModified('people');
        await group.save();

        res.sendStatus(200);
    }
};

let latestPing = (req, res, next) => {

};

module.exports = {
    create,
    join,
    acceptInvitation,
    subgroups,
    allSubgroups,
    changeSubgroup,
    latestPing,
};