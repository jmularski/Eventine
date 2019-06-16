const Action = require('../models/action');
const Group = require('../models/group');
const User = require('../models/user');
const sendDelayedNotif = require('../lib/sendDelayedNotif');
const sendNotif = require('../lib/sendNotif');
var winston = require('winston');
require('winston-loggly-bulk');

/** @api { post } /action/create
 *  @apiDescription Create action for given group
 *  @apiName actionCreate
 *  @apiGroup action
 *
 *  @apiParam (Body) {String} groupId - id of group
 *  @apiParam (Body) {String} type - ping or info
 *  @apiParam (Body) {String} title - title of ping
 *  @apiParam (Body) {String} desc - description of ping
 *  @apiParam (Body) {Array} targetGroups - array of subgroups for ping
 *  @apiParam (Body) {Time} plannedTime - time you want info to fire up
 *  @apiParam (Body) {Array} geo - array consisting of lat and lng
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Int} Only 200
 */

const create = async (req, res) => {
    let { groupId, type, title, desc, targetGroups, targetUsers, plannedTime, geo, floor } = req.body;
    let { id, fullName } = req.token;
    let status = 'sent';
    plannedTime = new Date();
    if(plannedTime) {
        plannedTime = new Date(plannedTime);
    }
    let action = new Action({
        groupId,
        type,
        creator: {
            id,
            name: fullName,
        },
        title,
        desc,
        status,
        targetGroups,
        targetUsers,
        plannedTime,
        geo,
        floor,
    });

    await action.save();

    let usersIds = targetUsers;
    let userNotifs = await User.find({
        _id: {
            $in: usersIds,
        },
    }).select('-_id notifToken').exec();
    let notifIds = userNotifs.map(person => person.notifToken);
    let payload = {
        notification: {
            title,
            body: desc,
            sound: 'default',
        },
        data: {
            title,
            desc,
            action: 'create',
            type: 'ping',
        },
    };

    if(!plannedTime || plannedTime < Date.now()) sendNotif(payload, notifIds);
    else sendDelayedNotif(payload, notifIds, plannedTime);

    winston.log('info', 'Action created!', {tags: 'action'});
    res.sendStatus(200);
};

/** @api { get } /action/list/:groupId
 *  @apiDescription get actions for given group
 *  @apiName actionsList
 *  @apiGroup action
 *
 *  @apiParam (Params) {String} groupId - id of group
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} Object that looks like this {'actions': [{
 *  id,
 *  groupId,
 *  type
 *  createdAt,
 *  creator (containing fields id and name),
 *  title,
 *  desc,
 *  targetGroups,
 *  plannedTime,
 *  geo,
 *  status,
 *  progressor (containing fields id and name)
 *  executor (containing fields id and name),
 *  }]}
 */

const list = async (req, res) => {
    let { groupId, type } = req.params;
    let { id } = req.token;
    let group = await Group.findById(groupId).exec();
    if( !group ) res.sendStatus(403);
    let user = group.people.filter( person => {
        return person.id == id;
    });
    let userStatus = user[0].subgroup;
    let actions;
    if(userStatus === 'Organizatorzy') {
        actions = await Action.find({ groupId }).exec();
    } else {
        actions = await Action.find({$or: [
                { groupId,
                $or: [
                    {'plannedTime': { '$gte': new Date()}},
                    {'plannedTime': null},
                ],
                $or: [
                    { targetGroups: userStatus },
                    { targetUsers: id},
                ],
                status: {$ne: 'ended'}},
                { groupId, 'creator.id': id}],
        }).exec();
    }
    if(type !== 'all') actions = actions.filter((action) => action.type === type);
    res.send({actions});
};

/** @api { post } /ping/inProgress
 *  @apiDescription set status in progress for given ping
 *  @apiName pingInProgress
 *  @apiGroup ping
 *
 *  @apiParam (Params) {String} pingId - id of ping, /ping/list
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Int} Returns 200
 */

const inProgress = async (req, res) => {
    let { pingId } = req.body;
    let { id, fullName } = req.token;
<<<<<<< HEAD
    try {
        await Action.findByIdAndUpdate(pingId, { progressor: {id, name: fullName}, status: 'inProgress' });
        res.sendStatus(200);
    } catch (e) {
        res.send({'error': 'Action does not exist!'});
    }
    
=======
    await Action.findByIdAndUpdate(pingId, { progressor: {id, name: fullName}, status: 'inProgress' });
    res.sendStatus(200);
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
};

/** @api { post } /ping/end
 *  @apiDescription set status ended for given ping
 *  @apiName pingEnd
 *  @apiGroup ping
 *
 *  @apiParam (Params) {String} pingId - id of ping, /ping/list
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Int} Returns 200
 */

const end = async (req, res, next) => {
    let { pingId } = req.body;
    let { id, fullName } = req.token;
<<<<<<< HEAD
    try {
        await Action.findByIdAndUpdate(pingId, { executor: { id, name: fullName }, status: 'done' });
        res.sendStatus(200);
    } catch (e) {
        res.send({'error': 'Action does not exist!'})
    }
=======
    // fix me pls
    await Action.findByIdAndUpdate(pingId, { executor: { id, name: fullName }, status: 'done' });
    res.sendStatus(200);
>>>>>>> 5f19adf3cce4dd3c4d46deb4fc7337bef199dadb
};

module.exports = {
    create,
    list,
    inProgress,
    end,
};
