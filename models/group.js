var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
    groupCode: { type: String, required: true },
    people: { type: Array, required: true}
});

module.exports = mongoose.model('group', GroupSchema);