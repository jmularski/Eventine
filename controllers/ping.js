const admin = require('firebase-admin');
const Ping = require('../models/ping');
const Group = require('../models/group');
const User = require('../models/user');
const sendDelayedNotif = require('../lib/sendDelayedNotif');
const _ = require('lodash');

/** @api { post } /ping/create
 *  @apiDescription Create ping for given group
 *  @apiName pingCreate
 *  @apiGroup ping
 *  
 *  @apiParam (Body) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Body) {String} title - title of ping
 *  @apiParam (Body) {String} desc - description of ping
 *  @apiParam (Body) {Array} targetGroups - array of subgroups you target info to
 *  @apiParam (Body) {Time} plannedTime - time you want info to fire up
 *  @apiParam (Body) {Int} howManyPeople - number of people that should be assigned to the task
 *  @apiParam (Body) {Array} geo - array consisting of lat and lng 
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *  
 *  @apiSuccess {Int} Only 200 
 */

let create = async (req, res, next) => {
    let { groupId, title, desc, targetGroups, howManyPeople, plannedTime, geo } = req.body;
    let { id, fullName } = req.token;
    if(plannedTime) plannedTime = new Date(plannedTime);
    let ping = new Ping({
        groupId,
        creator: id,
        creatorName: fullName,
        title,
        desc,
        targetGroups,
        howManyPeople,
        plannedTime,
        geo,
    });

    await ping.save();

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
            /* notification: {
                title: `W twojej grupie powstał ping o nazwie ${title}`,
                body: `Opis: ${desc}`,
                sound: 'default'
            },*/
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
            if(!plannedTime && plannedTime>Date.now() && notifIds.length !== 0) await admin.messaging().sendToDevice(notifIds, payload);
            else sendDelayedNotif(payload, notifIds, plannedTime);
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
 *  @apiParam (Params) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *  
 *  @apiSuccess {Object} Object that probably look like this {'pings': [{
 *  id,
 *  groupId,
 *  createdAt,
 *  creator,
 *  creatorName,
 *  title,
 *  desc,
 *  targetGroups,
 *  howManyPeople,
 *  plannedTime,
 *  geo,
 *  ended,
 *  executor,
 *  executorName,
 *  currentPeopleNumber,
 *  inProgress,
 *  progressor,
 *  progressorName
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
    console.log(userStatus);
    if( !userStatus ) res.sendStatus(403);
    else if(userStatus === 'admin') {
        let pings = await Ping.find({ groupId, ended: false }).exec();
        res.send({pings});
    } else {
        let currentDate = new Date();
        let pings = await Ping.find({$or: [
                { groupId,
                $or: [
                    {'plannedTime': { '$gte': currentDate}},
                    {'plannedTime': null},
                ],
                targetGroups: userStatus,
                ended: false },
                { groupId, creator: id}],
        }).exec();
        res.send({pings});
    }
};

/** @api { post } /ping/inProgress
 *  @apiDescription set status in progress for given ping
 *  @apiName pingInProgress
 *  @apiGroup ping
 *  
 *  @apiParam (Params) {String} pingId - id of ping, you can get it from /ping/list
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *  
 *  @apiSuccess {Int} Returns 200   
 */

let inProgress = async (req, res, next) => {
    let { pingId } = req.body;
    let { id, fullName } = req.token;
    await Ping.findByIdAndUpdate(pingId, { progressor: id, progressorName: fullName, inProgress: true }).exec();
    res.sendStatus(200);
};

/** @api { post } /ping/end
 *  @apiDescription set status in progress for given ping
 *  @apiName pingEnd
 *  @apiGroup ping
 *  
 *  @apiParam (Params) {String} pingId - id of ping, you can get it from /ping/list
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *  
 *  @apiSuccess {Int} Returns 200   
 */

let end = async (req, res, next) => {
    let { pingId } = req.body;
    let { id, fullName } = req.token;
    await Ping.findByIdAndUpdate(pingId, { executor: id, executorName: fullName, ended: true });
    res.sendStatus(200);
};

module.exports = {
    create,
    list,
    inProgress,
    end,
};
