var User = require('../models/user');

var updateToken = async (req, res) => {
    var { id, fullName } = req.token;
    var { notifToken } = req.body;

    await User.findByIdAndUpdate(id, {notifToken}).exec();
    res.sendStatus(200);
}

module.exports = {
    updateToken
};