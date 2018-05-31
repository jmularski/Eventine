var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    facebookId: {type: String, required: false},
    email: {type: String, required: false},
    password: {type: String, required: false},
    fullName: {type: String, required: true},
    notifToken: {type: String, required: false},
    invitations: {type: Array, default: []},
    groups: {type: Array, default: []}
});

module.exports = mongoose.model('user', UserSchema);