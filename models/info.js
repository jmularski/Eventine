var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
    groupId: { type: String, required: true },
    createdAt: {type: Date, default: Date.now},
    creator: { type: String, required: true },
    creatorName: { type: String, required: true },
    content: { type: String, required: true },
    targetGroups: { type: [String], required: true },
    plannedTime: { type: Date, required: false }
});

module.exports = mongoose.model('info', InfoSchema);