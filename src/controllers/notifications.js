const User = require('../models/user');

/** @api { post } /notif/updateToken
 *  @apiDescription Update notification token of given user
 *  @apiName notifUpdateToken
 *  @apiGroup notif
 *  
 *  @apiParam (Body) {String} notifToken - notification token that I will use to send you notifs later 
 *  @apiParam (Header) {String} X-Token - token received from /auth routes
 *  
 *  @apiSuccess {Int} Only 200 
 */

let updateToken = async (req, res) => {
    let { id } = req.token;
    let { notifToken } = req.body;

    await User.findByIdAndUpdate(id, { notifToken }).exec();
    res.sendStatus(200);
};

module.exports = {
    updateToken,
};
