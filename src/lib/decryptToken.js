const jwt = require('jsonwebtoken');
module.exports = (token) => {
    return jwt.verify(token, 'kalejdoskop');
};
