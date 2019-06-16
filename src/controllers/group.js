require('express-validator');
const admin = require('firebase-admin');
const Group = require('../models/group');
const User = require('../models/user');
const Help = require('../models/help');
const GroupError = require('../lib/errors/GroupError');
const decryptToken = require('../lib/decryptToken');
const sendNotif = require('../lib/sendNotif');
var winston = require('winston');
require('winston-loggly-bulk');

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
            notEmpty: { errorMessage: 'Missing group name' },
        },
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new GroupError(validationErrors[0]));

    let { groupName, facebookIds, normalIds } = req.body;
    let { id, fullName } = req.token;


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

<<<<<<< HEAD
=======
    let peopleIds = peopleData.map(person => person.id);

>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
    // adding admin to groups
    await User.update({'_id': id}, {$push: {groups: {id: newGroup.id, name: groupName}}}).exec();

    let peopleSchema = [];

    peopleSchema.push({
        id: id,
        name: fullName,
        subgroup: 'admin',
        location: '',
    });

    // adding normal people to group
    newGroup.groupCode = groupName;
    newGroup.people = peopleSchema;
    newGroup.groupName = groupName;
    await newGroup.save();

    // send notification
    if(peopleData.length > 0) {
        let notifIds = peopleData.map(person => person.notifToken);
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

        sendNotif(payload, notifIds);
    }

    res.send(newGroup.id);
};

/** @api { post } /group/join
 *  @apiDescription Join group with a given groupName
 *  @apiName groupJoin
 *  @apiGroup group
 *
 *  @apiParam (Body) {String} groupName - name of group, required parameter
<<<<<<< HEAD
 *  @apiParam (Body) {String} isPartner - whether user should be into partner group, optional parameter
=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *
 *  @apiSuccess {String} string containing id of joined group
 */

<<<<<<< HEAD
let join = async (req, res, next) => {
    req.checkBody({
        groupName: {
            notEmpty: { errorMessage: 'Missing group name' },
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new GroupError(validationErrors[0]));

    let { groupName, isPartner } = req.body;
    let { id, fullName } = req.token;
    let subgroup = isPartner ? 'partner' : 'user';

    let userData = {
        id,
        name: fullName,
        subgroup,
        location: '',
    };

    try {
        const groupUpdated = await Group.findOneAndUpdate({groupName}, { $push: { people: userData }}).exec();
        await User.findOneAndUpdate({'_id': id}, { $push: { groups: { id: groupUpdated.id, name: groupUpdated.groupName }}});
        res.send(groupUpdated.id);
    } catch (e) {
        return next(new GroupError(e));
    };
=======
let join = async (token, groupName, isPartner) => {
    let { id, fullName } = decryptToken(token);
    let subgroup = isPartner ? 'partner' : 'user';
    let data = {
        id: id,
        name: fullName,
        subgroup: subgroup,
        location: '',
    };
    if(!groupName) res.sendStatus(403);
    let groupUpdated = await Group.findOneAndUpdate({groupName}, { $push: { people: data }}).exec();
    await User.findOneAndUpdate({'_id': id}, { $push: { groups: { id: groupUpdated.id, name: groupUpdated.groupName }}});
    res.send(groupUpdated.id);
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
};

/** @api { get } /group/members/:groupId
 *  @apiDescription Get members of group with given groupId
 *  @apiName groupJoin
 *  @apiGroup group
 *
<<<<<<< HEAD
 *  @apiParam (Body) {Int} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} JSON object, structured like this - {"people": [{id: id,
        name: fullName,
        subgroup: subgroup,
        location: location
    }]}
 */

let members = async (req, res, next) => {
    req.checkParams({
        groupId: {
            notEmpty: { errorMessage: 'Missing group id'},
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new GroupError(validationErrors[0]));
    
=======
 *  @apiParam (Body) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} Some weird JSON object, structured (I guess) like this - {"people": [{id: id,
        name: fullName,
        subgroup: subgroup}]}
 */

let members = async (req, res, next) => {
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
    let { groupId } = req.params;
    let groupMembers = await Group.findById(groupId).select('-_id people').exec();

    res.send(groupMembers);
};

/** @api { post } /group/changeSubgroup
 *  @apiDescription Change subgroup of given member of given group.
 *  @apiName groupChangeSubgroup
 *  @apiGroup group
 *
<<<<<<< HEAD
 *  @apiParam (Body) {Int} groupId - id of group, you can get it from /user/invitations
=======
 *  @apiParam (Body) {String} groupId - id of group, you can get it from /user/invitations
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
 *  @apiParam (Body) {String} changingId - id of person, that you want to change groups
 *  @apiParam (Body) {String} changedSubgroup - name of subgroup you want to move person to
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
<<<<<<< HEAD
 *  @apiSuccess {Int} 200 if succeed
 *  @apiFailure {Int} 403 if not in organizer subgroup
=======
 *  @apiSuccess {Int} Only 200
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
 */

let changeSubgroup = async (req, res, next) => {
    let { changingId, groupId, changedSubgroup } = req.body;
    let { id } = req.token;

    let group = await Group.findById(groupId).exec();
    let user = group.people.find(person => {
        if(person.id === id) return person;
    });
    let userSubgroup = user.subgroup;
    if(userSubgroup !== 'Organizatorzy') res.sendStatus(403);
    else {
        group.people.find(person => {
            if(person.id == changingId) return person;
        }).subgroup = changedSubgroup;
        group.markModified('people');
        await group.save();

        res.sendStatus(200);
    }
};

<<<<<<< HEAD
/**
 * @api /group/location
 * @apiDescription update location of a given user
 * @apiName groupUpdateLocation
 * @apiGroup group
 * 
 * @apiParam (Body) {Int} groupId - id of group 
 * @apiParam (Body) {String} locationTag - tag of location which you want to update
 * @apiParam (Header) {String} X-Token - token received from /auth routes
 * 
 * @apiSuccess {Int} 200 if succeed
 */

=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
let updateLocation = async (req, res) => {
    let { groupId, locationTag } = req.body;
    let { id } = req.token;
    let group = await Group.findById(groupId).exec();
    group.people.find(person => person.id === id).location = locationTag;
    group.markModified('people');
    await group.save();
    res.sendStatus(200);
};

<<<<<<< HEAD
/**
 * @api /group/pingOrganizer
 * @apiDescription ping closest organizer to given user
 * @apiName groupPingOrganizer
 * @apiGroup group 
 * 
 * @apiParam (Body) {Int} organizerId - id of organizer who you want to call
 * @apiParam (Body) {String} callLocation - tag of location in which call started
 * @apiParam (Header) {String} X-Token - token received from /auth routes
 * 
 * @apiSuccess {Int} 200 and sends notification if succeed
 */

=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
let pingOrganizer = async (req, res) => {
    let { organizerId, callLocation } = req.body;
    let { id, fullName } = req.token;
    let notifToken = await User.findById(organizerId).select('-_id notifToken').exec();
    let newHelp = new Help({
        caller: {
            id,
            fullName,
        },
        called: organizerId,
    });
    newHelp.save();
    if(notifToken) {
        let payload = {
            notification: {
                title: `${fullName} is searching for you!`,
                body: `Find him at ${callLocation}`,
                sound: 'default',
            },
            data: {
                title: `${fullName} is searching for you!`,
                desc: `Find him at ${callLocation}`,
                location: callLocation,
                callerId: newHelp.id,
                action: 'findOrganizer',
            },
        };
        sendNotif(payload, notifToken.notifToken);
    };
    winston.log('info', 'Organiser called!', {tags: 'help'});
    res.sendStatus(200);
};

<<<<<<< HEAD
/**
 * @api /group/nearest
 * @apiDescription ping closest people to given user
 * @apiName groupNearest
 * @apiGroup group
 * 
 * @apiParam (Body) {Int} groupId - group from which we want to ping nearest people 
 * @apiParam (Header) {String} X-Token - token received from /auth routes
 * 
 * @apiSuccess {Int} 200 and sends notif
 */

=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
let nearest = async (req, res) => {
    let { groupId } = req.body;
    let { id, fullName} = req.token;
    let group = await Group.findById(groupId).exec();
    let userLocation = group.people.find( person => person.id === id).location;
    let otherUsers = group.people.filter( person => person.location === userLocation );
    otherUsers = otherUsers.filter( person => person.subgroup !== 'partner');
    otherUsers = otherUsers.filter( person => person.id !== id);
    let otherUsersId = otherUsers.map(user => user.id);
    let users = await User.find({id: {$in: otherUsersId}}).exec();
    let usersNotifTokens = users.map(user => user.notifToken);
    let newHelp = new Help({
        caller: {
            id,
            fullName,
        },
        called: otherUsersId,
    });
    await newHelp.save();
    if(usersNotifTokens) {
        let payload = {
            notification: {
                title: `${fullName} is calling for help!`,
                body: `Find him at ${userLocation}`,
                sound: 'default',
            },
            data: {
                title: `${fullName} is calling for help!`,
                desc: `Find him at ${userLocation}`,
                location: userLocation,
                callerId: newHelp.id,
                action: 'help',
            },
        };
        sendNotif(payload, usersNotifTokens);
    };
    winston.log('info', 'Help used!', {tags: 'help'});
    res.sendStatus(200);
};

<<<<<<< HEAD
/**
 * @api /group/response
 * @apiDescription get response to ping from nearest or pingOrganizers
 * @apiName groupPingResponse
 * @apiGroup group
 * 
 * @apiParam (Body) {Int} callerId - id of person who created ping 
 * @apiParam (Body) {Boolean} response - response to given ping 
 * @apiParam (Header) {String} X-Token - token received from /auth routes
 * 
 * @apiSuccess 200 and notification
 */

=======
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
let response = async (req, res) => {
    let { callerId, response } = req.body;
    let { id, fullName } = req.token;
    let helpSchema = await Help.findById(callerId);
    let notifToken = await User.findById(helpSchema.caller.id).select('-_id notifToken').exec();
    if(response) helpSchema.accepted.push(id);
    else helpSchema.declined.push(id);
    await helpSchema.save();
    response = response ? 'accepted' : 'declined';
    let payload = {
        notification: {
            title: `${fullName} has ${response} your request!`,
            body: 'Hooray!',
            sound: 'default',
        },
        data: {
            title: `${fullName} has ${response} your request!`,
            desc: 'Hooray!',
            action: 'acceptRequest',
        },
    };
    sendNotif(payload, notifToken.notifToken);
    res.sendStatus(200);
};

<<<<<<< HEAD


//not used, remove
let listHelp = async (res) => {
=======
let listHelp = async (req, res) => {
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
    let helps = await Help.find();
    res.send(helps);
};

module.exports = {
    create,
    join,
    members,
    changeSubgroup,
    updateLocation,
    nearest,
    pingOrganizer,
    response,
    listHelp,
};
