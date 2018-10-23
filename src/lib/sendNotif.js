const admin = require('firebase-admin');

module.exports = async (payload, notifIds) => {
    try {
        if(notifIds.length > 0) await admin.messaging().sendToDevice(notifIds, payload);
    } catch(e){
        console.log("Error with notification sending!");
    }
};
