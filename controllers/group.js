require('express-validator');
var admin = require('firebase-admin');
var Group = require('../models/group');
var User = require('../models/user');
var GroupError = require('../lib/errors/GroupError');

var create = async (req, res, next) => {

    req.checkBody({
        groupName: {
            notEmpty: { errorMessage: "Missing groupName" }
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new GroupError(validationErrors[0]));

    var { groupName, facebookIds } = req.body;
    var { id, fullName } = req.token;
    var groupCode = groupName;

    //update User invitations field and create a new Group object - I should get rid of foreach, replace it with map (done)
    var newGroup = new Group();
    var peopleData = await User.find({
        'facebookId': {
            $in: facebookIds
        }
    }).select('_id fullName notifToken').exec();
    await User.updateMany({'id': { $in: peopleData }}, {$push: {invitations: {id: newGroup.id, name: groupName}}}).exec();
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

    newGroup.groupCode = groupCode;
    newGroup.people = peopleSchema;
    newGroup.groupName = groupName;
    await newGroup.save();

    //send notification
    var notifIds = peopleData.map(person => person.notifToken);
    
    var payload = {
        data: {
            groupName: groupName,
            action: 'invitation'
        }
    };

    await admin.messaging().sendToDevice(notifIds, payload);
    
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

    var groupUpdated = await Group.findOneAndUpdate({groupName}, { $push: { people: data }}).exec();
    var userUpdated = await User.findOneAndUpdate({id}, { $push: { groups: { id: groupUpdated.id, name: groupUpdated.groupName }}});
    if(!groupUpdated || !userUpdated) res.sendStatus(403);
    res.status(200).send(groupUpdated.id);
};
var acceptInvitation = (req, res, next) => {
    var { id, fullName } = req.token;
    var { invitation } = req.body;

    
}
var list = (req, res, next) => {

};
var invitations = (req, res, next) => {

};
var latestPing = (req, res, next) => {

};

module.exports = {
    create,
    join,
    acceptInvitation, 
    list,
    invitations,
    latestPing
};