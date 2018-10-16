const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ActionSchema = new Schema({
    groupId: { type: String, required: true },
    type: { type: String, required: true, enum: ['ping', 'info']},
    createdAt: {type: Date, default: Date.now},
    creator: {
        id: { type: String, required: true },
        name: { type: String, required: true }
    },
    title: { type: String, required: true },
    desc: { type: String, required: false },
    targetGroups: { type: [String], default: [] },
    plannedTime: { type: Date, required: false },
    geo: { type: [Number], index: '2d', required: false },
    floor: { type: Number, required: false },
    status: { type: String, required: true, enum: ["planned", "sent", "inProgress", "done"]},
    progressor: {
        id: { type: String, required: false},
        name: { type: String, required: false}
    },
    executor: {
        id: { type: String, required: false },
        name: { type: String, required: false }
    }
});

module.exports = mongoose.model('action', ActionSchema);
