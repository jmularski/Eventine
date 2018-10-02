const admin = require('firebase-admin');
const Action = require('../models/action');
const Group = require('../models/group');
const User = require('../models/user');
const sendDelayedNotif = require('../lib/sendDelayedNotif');
const _ = require('lodash');

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

let create = async (req, res, next) => {
    let { groupId, type, title, desc, targetGroups, plannedTime, geo } = req.body;
    let { id, fullName } = req.token;
    let status = 'sent';
    if(plannedTime) {
        plannedTime = new Date(plannedTime);
        status = 'planned'
    }
    let action = new Action({
        groupId,
        type,
        creator: {
            id,
            name: fullName
        },
        title,
        desc,
        status,
        targetGroups,
        plannedTime,
        geo,
    });

    await action.save();

    if(targetGroups) {
        let group = await Group.findById(groupId).exec();

        let usersInTarget = group.people.filter(person => {
            if(targetGroups.includes(person.subgroup)) {
                return true;
            }
            return false;
        });

        let usersIds = usersInTarget.map(person => {
            if(person.id) return person.id;
        });

        let userNotifs = await User.find({
            _id: {
                $in: usersIds,
            },
        }).select('-_id notifToken').exec();

        let payload = {
            data: {
                title,
                desc,
                action: 'create',
                type: 'ping',
            },
        };
        let notifIds = userNotifs.map(person => {
            if(person.notifToken) return person.notifToken;
        });
        notifIds = notifIds.filter(id => {
            if(_.isEmpty(id)) return false;
            else return true;
        });
        try {
            if(!plannedTime && plannedTime>Date.now() && notifIds.length !== 0) {
                await admin.messaging().sendToDevice(notifIds, payload);
            } else sendDelayedNotif(payload, notifIds, plannedTime);
        } catch(e) {
            console.log(e);
        }
    }

    res.sendStatus(200);
};

/** @api { get } /ping/list/:groupId
 *  @apiDescription get pings for given group
 *  @apiName pingList
 *  @apiGroup ping
 *
 *  @apiParam (Params) {String} groupId - id of group
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *
 *  @apiSuccess {Object} Object that probably look like this {'pings': [{
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

let list = async (req, res, next) => {
    let { groupId } = req.params;
    let { id } = req.token;
    let group = await Group.findById(groupId).exec();
    if( !group ) res.sendStatus(403);
    let user = group.people.filter( person => {
        return person.id == id;
    });
    let userStatus = user[0].subgroup;
    if(userStatus === 'admin') {
        let pings = await Action.find({ groupId, ended: false }).exec();
        res.send({pings});
    } else {
        let pings = await Action.find({$or: [
                { groupId,
                type: 'ping',
                $or: [
                    {'plannedTime': { '$gte': new Date()}},
                    {'plannedTime': null},
                ],
                targetGroups: userStatus,
                $or: [
                    {status: 'sent'},
                    {status: 'inProgress'}
                ]},
                { groupId, 'creator.id': id}],
        }).exec();
        res.send({pings});
    }
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

let inProgress = async (req, res, next) => {
    let { pingId } = req.body;
    let { id, fullName } = req.token;
    await Action.findByIdAndUpdate(pingId, { progressor: {id, name: fullName}, status: 'inProgress' });
    res.sendStatus(200);
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

let end = async (req, res, next) => {
    let { pingId } = req.body;
    let { id, fullName } = req.token;
    // fix me pls
    await Action.findByIdAndUpdate(pingId, { executor: { id, name: fullName }, status: "done" });
    res.sendStatus(200);
};

module.exports = {
    create,
    list,
    inProgress,
    end,
};
