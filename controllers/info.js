const admin = require('firebase-admin');
const Info = require('../models/info');
const Group = require('../models/group');
const User = require('../models/user');
const sendDelayedNotif = require('../lib/sendDelayedNotif');
const _ = require('lodash');

/** @api { post } /info/create
 *  @apiDescription Create info for given group
 *  @apiName infoCreate
 *  @apiGroup info
 *  
 *  @apiParam (Body) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Body) {String} content - content of info
 *  @apiParam (Body) {Array} targetGroups - array of subgroups you target info to
 *  @apiParam (Body) {Time} plannedTime - time you want info to fire up
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *  
 *  @apiSuccess {Int} Only 200 
 */

let create = async (req, res, next) => {
    let { groupId, content, targetGroups, plannedTime } = req.body;
    let { id, fullName } = req.token;

    if(plannedTime) plannedTime = new Date(plannedTime);

    let newInfo = new Info({
        groupId,
        creator: id,
        creatorName: fullName,
        content,
        targetGroups,
        plannedTime,
    });

    await newInfo.save();

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
            notification: {
                title: `Twojej grupie została przekazana informacja`,
                body: `Opis: ${content}`,
                sound: 'default',
            },
            data: {
                content,
                action: 'infoCreate',
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
            if(!plannedTime && plannedTime>Date.now()) await admin.messaging().sendToDevice(notifIds, payload);
            else sendDelayedNotif(payload, notifIds, plannedTime);
        } catch(e) {
            console.log(e);
        }
    }

    res.sendStatus(200);
};

/** @api { get } /info/list/:groupId
 *  @apiDescription List info for given group
 *  @apiName infoList
 *  @apiGroup info
 *  
 *  @apiParam (Params) {String} groupId - id of group, you can get it from /user/invitations
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *  
 *  @apiSuccess {Object} Object that probably look like this {'info': [{
 *  id,
 *  groupId,
 *  createdAt,
 *  creator,
 *  creatorName,
 *  content,
 *  targetGroups,
 *  plannedTime
 *  }]}  
 */

let list = async (req, res, next) => {
    let { groupId } = req.params;
    let { id } = req.token;

    let group = await Group.findById(groupId).exec();
    if( !group ) res.sendStatus(403);
    let user = group.people.find( person => person.id == id );
    let userStatus = user[0].subgroup;
    if( !userStatus ) res.sendStatus(403);
    else if(userStatus === 'admin') {
        let info = await Info.find({ groupId }).exec();
        res.send({info});
    } else {
        let info = await Info.find({ groupId, targetGroups: userStatus}).exec();
        res.send({info});
    }
};

module.exports = {
    create,
    list,
};
