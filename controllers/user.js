const User = require('../models/user');
const Group = require('../models/group');
const Ping = require('../models/ping');

async function getUserData(id, field) {
    let result = await User.findById(id).select(field);
    return result;
};

let groupList = async (req, res, next) => {
    let { id } = req.token;
    let groups = await getGroupData(id, 'groups');
    res.send({groups: groups.groups});
};

let invitations = async (req, res, next) => {
    let { id } = req.token;
    let invitations = await getUserData(id, 'invitations');
    res.send({invitations: invitations.invitations});
};

let getTasks = async (req, res, next) => {
    let { id } = req.token;
    let user = await User.findById(id).exec();
    if(user.groups) {
        let groupId = user.groups[0].id;

        // getting subgroup of user
        let foundGroup = await Group.findById(groupId).exec();
        let subgroupOfUser = foundGroup.people.filter(person => {
            return person.id === id;
        })[0].subgroup;

        // getting pings of group
        let currentDate = new Date();
        let foundPings = await Ping.find({ groupId,
            $or: [
                {'plannedTime': { '$gte': currentDate}},
                {'plannedTime': null},
            ],
            targetGroups: subgroupOfUser,
            ended: false}).exec();
        res.send({pings: foundPings});
    } else {
        res.sendStatus(204);
    }
};

let returnFriends = async (req, res, next) => {
    let { id } = req.token;
    let user = User.findById(id).exec();
    if(user.facebookId) {
        let users = await User.find({'facebookId': { '$exists': false } }).select('fullName').exec();
    } else {
        let users = await User.find({'_id': { $ne: id }}).exec();
    }
    res.send({users});
};

module.exports = {
    groupList,
    invitations,
    getTasks,
    returnFriends,
};
