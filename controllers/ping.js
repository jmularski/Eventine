var admin = require('firebase-admin');
var Ping = require('../models/ping');
var Group = require('../models/group');
var User = require('../models/user');

var create = async (req, res, next) => {
    var { groupId, title, desc, targetGroups, howManyPeople, plannedTime, geo } = req.body;
    var { id, fullName } = req.token;

    var ping = new Ping({
        groupId,
        creator: id,
        creatorName: fullName,
        title,
        desc,
        targetGroups,
        howManyPeople,
        plannedTime,
        geo
    });

    await ping.save();

    var group = await Group.findById(groupId).exec();
    if(targetGroups){
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
            data: {
                title,
                desc,
                action: "pingCreate"
            }
        };
        console.log(userNotifs);
        var notifIds = userNotifs.map(person => { if(person.notifToken) return person.notifToken});
        await admin.messaging().sendToDevice(notifIds, payload);
    }
    
 
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
        var pings = await Ping.find({ groupId, ended: false }).exec();
        res.send({pings});
    } else {
        var currentDate = new Date();
        var pings = await Ping.find({ groupId, 
            $or: [
                {'plannedTime': { "$gte": currentDate}},
                {'plannedTime': null}
            ],
            targetGroups: userStatus,
            ended: false}).exec();
        res.send({pings});
    }
};

var end = async (req, res, next) => {
    var { pingId } = req.body;
    var { id, fullName } = req.token;
    await Ping.findByIdAndUpdate(pingId, { executor: id, executorName: fullName, ended: true });
    res.sendStatus(200);
}

module.exports = {
    create,
    list,
    end
};