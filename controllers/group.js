require('express-validator');
var admin = require('firebase-admin');
var Group = require('../models/group');
var User = require('../models/user');
var GroupError = require('../lib/errors/GroupError');
var _ = require('lodash');

var create = async (req, res, next) => {

    req.checkBody({
        groupName: {
            notEmpty: { errorMessage: "Missing groupName" }
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new GroupError(validationErrors[0]));

    var { groupName, facebookIds, normalIds } = req.body;
    var { id, fullName } = req.token;
    var groupCode = groupName;

    
    //update User invitations field and create a new Group object - I should get rid of foreach, replace it with map (done)
    var newGroup = new Group();
    var normalData = await User.find({
        '_id':{
            $in: normalIds
        }
    }).select('_id fullName notifToken').exec();

    var facebookData = await User.find({
        'facebookId': {
            $in: facebookIds
        }
    }).select('_id fullName notifToken').exec();
    
    var peopleData = normalData.concat(facebookData);

    var peopleIds = peopleData.map(person => person.id);
    await User.updateMany({'_id': { $in: peopleIds }}, {$push: {invitations: {id: newGroup.id, name: groupName, invitedBy: fullName}}}).exec();
    
    //adding admin to groups
    await User.update({'_id': id}, {$push: {groups: {id: newGroup.id, name: groupName}}}).exec();

    var peopleSchema = [];
    peopleSchema = peopleData.map( person => {
        return {
            id: person.id,
            name: person.fullName,
            subgroup: 'invited'
        }
    });
    peopleSchema.push({
        id: id,
        name: fullName,
        subgroup: 'admin'
    });

    //adding normal people to group
    

    newGroup.groupCode = groupCode;
    newGroup.people = peopleSchema;
    newGroup.groupName = groupName;
    await newGroup.save();

    //send notification
    if(peopleData){
        var notifIds = peopleData.map(person => person.notifToken);
        if(notifIds.length != 0){
            var payload = {
                data: {
                    groupName: groupName,
                    action: 'invitation'
                }
            };
    
            await admin.messaging().sendToDevice(notifIds, payload);
        }
    }
    
    res.status(200).send(newGroup.id);
};
var join = async (req, res, next) => {
    var { groupName } = req.body;
    var { id, fullName } = req.token;

    var data = {
        id: id,
        name: fullName,
        subgroup: 'user'
    };

    if(!groupName) res.sendStatus(403);
    var groupUpdated = await Group.findOneAndUpdate({groupName}, { $push: { people: data }}).exec();
    var userUpdated = await User.findOneAndUpdate({'_id': id}, { $push: { groups: { id: groupUpdated.id, name: groupUpdated.groupName }}});
    
    res.status(200).send(groupUpdated.id);
};
var acceptInvitation = async (req, res, next) => {
    var { id, fullName } = req.token;
    var { groupId } = req.body;

    var group = await Group.findById(groupId).exec();
    group.people = group.people.filter(person => { return person.id !== id})
    group.people.push({
        id: id,
        name: fullName,
        subgroup: 'user'
    });
    
    var user = await User.findById(id).exec();

    user.invitations = user.invitations.filter(group => { return group.id !== groupId})

    user.groups.push({
        id: group.id, 
        name: group.groupName
    });

    await group.save();
    await user.save();

    res.send(groupId);
}

var subgroups = async (req, res, next) => {
    var { groupId } = req.params;
    var groupMembers = await Group.findById(groupId).select("-_id people").exec();

    res.send(groupMembers);
};

var allSubgroups = async ( req, res, next ) => {
    var { groupId } = req.params;
    var groupMembers = await Group.findById(groupId).select("-_id people").exec();
    console.log(groupMembers);
    const unique = [...new Set(groupMembers.people.map(item => item.subgroup))];

    res.send(unique);
}

var changeSubgroup = async (req, res, next) => {
    var { changingId, groupId, changedSubgroup } = req.body
    var { id } = req.token;

    var group = await Group.findById(groupId).exec();
    var userSubgroup = group.people.filter(person => { if (person.id === id) return person});
    var userSubgroup = userSubgroup[0].subgroup;
    console.log(userSubgroup);
    if(userSubgroup != 'admin') res.sendStatus(403);
    else{
        group.people.filter(person => { if(person.id == changingId) return person})[0].subgroup = changedSubgroup;
        group.markModified('people');
        await group.save();

        res.sendStatus(200);
    }
    
};

var latestPing = (req, res, next) => {

};

module.exports = {
    create,
    join,
    acceptInvitation,
    subgroups,
    allSubgroups,
    changeSubgroup,
    latestPing
};