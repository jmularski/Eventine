const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GroupSchema = new Schema({
    groupCode: { type: String, required: true },
    groupName: { type: String, required: true },
    people: { type: Array, required: true},
});

module.exports = mongoose.model('group', GroupSchema);
