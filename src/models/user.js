const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    facebookId: {type: String, required: false},
    email: {type: String, required: false},
    password: {type: String, required: false},
    fullName: {type: String, required: true},
    notifToken: {type: String, required: false},
    invitations: {type: Array, default: []},
    groups: {type: Array, default: [{id: '5bc4f824b6e0ec0010fa3e03', name: 'Grupa domyślna3'}]},
    isPartner: { type: Boolean, default: false}
});

module.exports = mongoose.model('user', UserSchema);
