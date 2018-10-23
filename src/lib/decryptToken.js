const jwt = require('jsonwebtoken');
module.exports = (token) => {
    jwt.verify(token, 'kalejdoskop', (err, decoded) => {
        if(err) return {success: false, message: 'Your token is bad.'};
        else {
            return {success: true, token: decoded};
        }
    });
}
