const admin = require('firebase-admin');

module.exports = async (payload, notifIds, time) => {
    let dateNow = Date.now();
    let diff = Math.abs(time - dateNow);
    setTimeout( async () => {
        await admin.messaging().sendToDevice(notifIds, payload);
    }, diff);
};
