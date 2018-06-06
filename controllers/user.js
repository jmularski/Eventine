var User = require('../models/user');
var Group = require('../models/group');
var Ping = require('../models/ping');

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
var getTasks = async (req, res, next) => {
    var { id } = req.token;
    var user = await User.findById(id).exec();
    if(user.groups) {
        var groupId = user.group[0].id;

        //getting subgroup of user
        var foundGroup = await Group.findById(groupId).exec();
        var subgroupOfUser = foundGroup.people.filter(person => { return person.id === id})[0].subgroup;

        //getting pings of group
        var currentDate = new Date();
        var foundPings = await Ping.find({ groupId, 
            $or: [
                {'plannedTime': { "$gte": currentDate}},
                {'plannedTime': null}
            ],
            targetGroups: subgroupOfUser,
            ended: false}).exec();
        res.send({pings: foundPings});

    } else {
        res.sendStatus(204);
    }
};
var returnFriends = async (req, res, next) => {
    var users = await User.find({"facebookId": { "$exists": false } }).select('fullName').exec();
    res.send({users});
};
module.exports = {
    groupList,
    invitations,
    getTasks,
    returnFriends
};