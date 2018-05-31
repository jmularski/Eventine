require('express-validator');
var admin = require('firebase-admin');
var Group = require('../models/group');
var User = require('../models/user');
var GroupError = require('../lib/errors/GroupError');

var create = async (req, res, next) => {

    req.checkBody({
        groupCode: {
            notEmpty: { errorMessage: "Missing groupCode" }
        },
        groupName: {
            notEmpty: { errorMessage: "Missing groupName" }
        }
    });
    let validationErrors = req.validationErrors();
    if(validationErrors) return next(new GroupError(validationErrors[0]));

    var { groupCode, groupName, facebookIds } = req.body;
    var { id, fullName } = req.token;
    
    //update User invitations field and create a new Group object - I should get rid of foreach, replace it with map (done)
    var newGroup = new Group();
    var peopleData = await User.find({
        'facebookId': {
            $in: facebookIds
        }
    }).select('_id fullName notifToken').exec();
    await User.updateMany({'id': { $in: peopleData }}, {$push: {invitations: {id: newGroup.id, name: groupName}}}).exec();
    var peopleSchema;
    peopleSchema.push({
        id: id,
        name: fullName,
        subgroup: 'admin'
    });
    var personSchema = peopleData.map( person => {
        return {
            id: person.id,
            name: person.fullName,
            subgroup: 'invited'
        }
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
var join = (req, res, next) => {

};
var list = (req, res, next) => {

};
var invitations = (req, res, next) => {

};
var latestPing = (req, res, next) => {

};

module.exports = {
    create,
    join, 
    list,
    invitations,
    latestPing
};