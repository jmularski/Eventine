var admin = require('firebase-admin');
var Info = require('../models/info');
var Group = require('../models/group');
var User = require('../models/user');
var sendDelayedNotif = require('../lib/sendDelayedNotif');

var create = async (req, res, next) => {
    var { groupId, content, targetGroups, plannedTime } = req.body;
    var { id, fullName } = req.token;
    
    if(plannedTime) plannedTime = new Date(plannedTime);

    var newInfo = new Info({
        groupId,
        creator: id,
        creatorName: fullName,
        content,
        targetGroups,
        plannedTime
    });

    if(targetGroups && !plannedTime){
        var group = await Group.findById(groupId).exec();

        var usersInTarget = group.people.filter(person => { 
            if(targetGroups.includes(person.subgroup)){
                return true;
            }
            return false;
        });
        console.log(usersInTarget);
        var usersIds = usersInTarget.map(person => { if(person.id) return person.id });
        var userNotifs = await User.find({
            _id: {
                $in: usersIds
            }
        }).select("-_id notifToken").exec();

        var payload = {
            notification: {
                title: `Twojej grupie została przekazana informacja`,
                body: `Opis: ${content}`,
                sound: 'default'
            },
            data: {
                content,
                action: "infoCreate"
            }
        };
        console.log(userNotifs);
        var notifIds = userNotifs.map(person => { if(person.notifToken) return person.notifToken});
        if(!plannedTime) await admin.messaging().sendToDevice(notifIds, payload);
        else sendDelayedNotif(payload, notifIds, plannedTime);
    }
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