const User = require('../models/user');

let updateToken = async (req, res) => {
    let { id } = req.token;
    let { notifToken } = req.body;

    await User.findByIdAndUpdate(id, { notifToken }).exec();
    res.sendStatus(200);
};

module.exports = {
    updateToken,
};
