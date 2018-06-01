var admin = require('firebase-admin');
var Info = require('../models/info');
var Group = require('../models/group');
var User = require('../models/user');

var create = async (req, res, next) => {
    var { groupId, content, targetGroups } = req.body;
    var { id } = req.token;

    var newInfo = new Info({
        groupId,
        creator: id,
        content,
        targetGroups
    });

    await newInfo.save();
    res.sendStatus(200);
};
var list = async (req, res, next) => {
    var { groupId } = req.params;
    var { id } = req.token;

    var group = await Group.findById(groupId).exec();
    if( !group ) res.sendStatus(403);
    var user = group.people.filter( person => { return person.id == id });
    var userStatus = user[0].subgroup;
    console.log(userStatus);
    if( !userStatus ) res.sendStatus(403);
    else if(userStatus === 'admin'){
        var info = await Info.find({ groupId }).exec();
        res.send({info});
    } else {
        var info = await Info.find({ groupId, targetGroups: userStatus}).exec();
        res.send({info});
    }

}

module.exports = {
    create,
    list
};