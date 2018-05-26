var mongoose = require('mongoose');
var Group = require('../models/group');
var User = require('../models/user');

var create = async (req, res, next) => {
    var { groupCode, facebookIds, creatorId } = req.body;
    var newGroup = new Group();
    var peopleId = await Group.find({
        'facebookId': {
            $in: facebookIds
        }
    }).select('_id').exec();
    await User.updateMany({'id': { $in: peopleId }}, {$push: {invitations: newGroup.id}}).exec();
    var peopleSchema;
    peopleSchema.push({
        id: creatorId,
        subgroup: 'admin'
    });
    peopleId.forEach(personId => {
        peopleSchema.push({
            id: personId,
            subgroup: 'invited',
        });
    });
    newGroup.groupCode = groupCode;
    newGroup.people = peopleSchema;
    await newGroup.save();
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