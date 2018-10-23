const admin = require('firebase-admin');
var winston = require('winston');
require('winston-loggly-bulk');
module.exports = async (payload, notifIds) => {
    try {
        if(notifIds.length > 0) await admin.messaging().sendToDevice(notifIds, payload);
        
    } catch(e){
        winston.log('error', "Error with sending notification!", {tags: "notif"});
    }
};
