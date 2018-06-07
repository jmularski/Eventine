var admin = require('firebase-admin');

module.exports = async (payload, notifIds, time) => {
    var dateNow = Date.now();
    var diff = Math.abs(time - dateNow);
    setTimeout( async () => {
        await admin.messaging().sendToDevice(notifIds, payload);
    }, diff);
};
