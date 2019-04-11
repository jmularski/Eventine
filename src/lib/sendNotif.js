const admin = require('firebase-admin');
const winston = require('winston');
require('winston-loggly-bulk');
module.exports = async (payload, notifIds) => {
    try {
        if(Array.isArray(notifIds)) {
            notifIds = notifIds.filter((el) => {
                return el != null;
            });
        }
        if(notifIds.length > 0) await admin.messaging().sendToDevice(notifIds, payload);
        winston.log('log', 'Notification sent', {tags: 'notif'});
    } catch(e) {
        winston.log('error', 'Error with sending notification: ' + e, {tags: 'notif'});
    }
};
