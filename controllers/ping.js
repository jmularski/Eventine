var Ping = require('../models/ping');
var Group = require('../models/group');

var create = async (req, res, next) => {
    var { groupId, title, desc, targetGroups, howManyPeople, plannedTime, lat, lng } = req.body;
    var { id } = req.token;

    var ping = new Ping({
        groupId,
        creator: id,
        title,
        desc,
        targetGroups,
        howManyPeople,
        plannedTime,
        geo: [lat, lng],
    });

    await ping.save();

    res.sendStatus(200);
};

var list = async (req, res, next) => {
    var { groupId } = req.params;
    var { id } = req.token;
    var group = await Group.findById(groupId).exec();
    if( !group ) res.sendStatus(403);
    var userStatus = (group.people.filter( person => { return person.id == id })).status;
    if( !userStatus ) res.sendStatus(403);
    else if(userStatus === 'admin'){
        var pings = await Ping.find({ groupId, ended: false }).exec();
        res.send(pings);
    } else {
        var currentDate = new Date();
        var pings = await Ping.find({ groupId, 
            $or: [
                {'plannedTime': { "$gte": currentDate}},
                {'plannedTime': null}
            ],
            targetGroups,
            ended: false}).exec();
        res.send(pings);
    }
};

module.exports = {
    create,
    list
};