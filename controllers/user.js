//require('express-validator');
//var admin = require('firebase-admin');
//var Group = require('../models/group');
var User = require('../models/user');

var list = (req, res, next) => {

};
var invitations = async (req, res, next) => {
    var { id } = req.token;
    var invitations = await User.findById(id).select('invitations');
    res.send({invitations: invitations.invitations});
};

module.exports = {
    list,
    invitations
};