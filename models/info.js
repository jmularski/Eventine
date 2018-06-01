var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
    groupId: { type: String, required: true },
    creator: { type: String, required: true },
    content: { type: String, required: true },
    targetGroups: { type: String, required: true }
});

module.exports = mongoose.model('info', GroupSchema);