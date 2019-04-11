const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    facebookId: {type: String, required: false},
    email: {type: String, required: false},
    password: {type: String, required: false},
    fullName: {type: String, required: true},
    notifToken: {type: String, required: false},
    invitations: {type: Array, default: []},
    groups: {type: Array, default: []},
    isPartner: { type: Boolean, default: false},
    careTaker: { type: String, required: false },
});

module.exports = mongoose.model('user', UserSchema);
