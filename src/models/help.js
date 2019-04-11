const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let HelpSchema = new Schema({
    caller: {
        id: { type: String, required: true },
        fullName: { type: String, required: true },
    },
    called: { type: Array, required: true },
    accepted: { type: Array, default: [] },
    declined: { type: Array, default: [] },
});

module.exports = mongoose.model('help', HelpSchema);
