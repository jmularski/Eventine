//require('express-validator');
//var admin = require('firebase-admin');
//var Group = require('../models/group');
var User = require('../models/user');

var groupList = async (req, res, next) => {
    var { id } = req.token;
    var groups = await User.findById(id).select('groups');
    res.send({groups: groups.groups});
};
var invitations = async (req, res, next) => {
    var { id } = req.token;
    var invitations = await User.findById(id).select('invitations');
    res.send({invitations: invitations.invitations});
};
var returnFriends = async (req, res, next) => {
    var users = await User.find({"facebookId": { "$exists": false } }).select('fullName').exec();
    res.send({users});
};
module.exports = {
    groupList,
    invitations,
    returnFriends
};