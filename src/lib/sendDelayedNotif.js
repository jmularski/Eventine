const admin = require('firebase-admin');

module.exports = async (payload, notifIds, time) => {
    let dateNow = Date.now();
    let diff = Math.abs(time - dateNow);
    setTimeout( async () => {
        await admin.messaging().sendToDevice(notifIds, payload);
    }, diff);
};

// setTimeout should be fine instead of setting up crons for not a lot of tasks
// After 7 months from finishing this project would use Agenda or sth like it though