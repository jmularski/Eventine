const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let HelpSchema = new Schema({
    caller: {
        id: { type: String, required: true },
        fullName: { type: String, required: true }
    },
    called: { type: [String], required: true },
    accepted: { type: [String], default: [] },
    declined: { type: [String], default: [] }
});

module.exports = mongoose.model('help', HelpSchema);
