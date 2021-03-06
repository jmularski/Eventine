const User = require('../models/user');
const Group = require('../models/group');
const Action = require('../models/action');
const sendNotif = require('../lib/sendNotif');
const redis = require('../lib/redis');

/**
 * Get user data from specific field
 * @param {String} id
 * @param {String} field
 * @return {Array} result
 */

async function getUserData(id, field) {
    //const redisAction = redis.get(field + id);
    //if(redisAction.result[field].length !== 0) return redisAction.result;
    let result = await User.findById(id).select(field).exec();
    //redis.set(field + id, result);
    return result;
};

/** @api { get } /user/groupList
 *  @apiDescription give groups that user is in
 *  @apiName userGroupList
 *  @apiGroup user
 *
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} Returns JSON object: {groups: [{
 *  id,
 *  name
 *  }]}
 */

let groupList = async (req, res) => {
    let { id } = req.token;
    let groups = await getUserData(id, 'groups');
    res.send({groups: groups.groups});
};

/** @api { get } /user/invitations
 *  @apiDescription give invitations that user has
 *  @apiName userInvitations
 *  @apiGroup user
 *
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} Returns JSON object: {invitations: [{
 *  id,
 *  name,
 *  invitedBy
 *  }]}
 */

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
        let foundPings = await Action.find({ groupId, type: 'ping',
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

/** @api { get } /user/friends
 *  @apiDescription give friends that user has
 *  @apiName userFriends
 *  @apiGroup user
 *
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} Returns JSON object: {users: [{
 *  id,
 *  fullName,
 *  }]}
 */

let returnFriends = async (req, res) => {
    let { id } = req.token;
    let user = User.findById(id).exec();
    let users;
    if(user.facebookId) {
        users = await User.find({'facebookId': { '$exists': false } })
                          .select('fullName').exec();
    } else {
        users = await User.find({'_id': { $ne: id }}).exec();
    }
    res.send({users});
};


//not used, turn off
let setCaretaker = async (req, res) => {
    let { caretakerId, partnerAccId } = req.body;
    let { id } = req.token;
    await User.findByIdAndUpdate(partnerAccId, {careTaker: caretakerId});
    res.sendStatus(200);
};
//^
let callCaretaker = async (req, res) => {
    let { id } = req.token;

    let partnerAcc = await User.findById(id);
    let caretakerId = partnerAcc.careTaker;
    let caretakerNotifToken = await User.findById(caretakerId);
    caretakerNotifToken = caretakerNotifToken.notifToken;
    let payload = {
        notification: {
            title: 'Zawołanie opiekuna',
            desc: 'Opiekun do ktorego jestes przypisany cię woła',
            sound: 'default',
        },
        data: {
            title: 'Zawołanie opiekuna',
            desc: 'Opiekun do ktorego jestes przypisany cię woła',
            action: 'callCaretaker',
        },
    };
    console.log(caretakerId);
    console.log(caretakerNotifToken);
    sendNotif(payload, caretakerNotifToken);
    res.sendStatus(200);
};

module.exports = {
    groupList,
    invitations,
    getTasks,
    returnFriends,
    setCaretaker,
    callCaretaker,
};
