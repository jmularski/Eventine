const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    facebookId: {type: String, required: false},
    email: {type: String, required: false},
    password: {type: String, required: false},
    fullName: {type: String, required: true},
    notifToken: {type: String, required: false},
    invitations: {type: Array, default: []},
    groups: {type: Array, default: [{id: '5bc4e90a3e23c90010bd0286', name: 'Grupa domyślna2'}]},
    isPartner: { type: Boolean, default: false}
});

module.exports = mongoose.model('user', UserSchema);
