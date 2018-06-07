var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PingSchema = new Schema({
    groupId: { type: String, required: true },
    creator: { type: String, required: true },
    creatorName: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    targetGroups: { type: [String], default: [] },
    howManyPeople: { type: Number, default: 1 },
    plannedTime: { type: Date, required: false },
    geo: { type: [Number], index: '2d' },
    ended: { type: Boolean, default: false },
    executor: { type: String, required: false },
    executorName: { type: String, required: false },
    currentPeopleNumber: { type: Number, default: 0 },
    inProgress: { type: Boolean, default: false },
    progressor: { type: String, required: false },
    progressorName: { type: String, required: false }
});

module.exports = mongoose.model('ping', PingSchema);