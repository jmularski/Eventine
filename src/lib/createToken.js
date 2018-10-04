const jwt = require('jsonwebtoken');
module.exports = (fullName, id) => {
    return jwt.sign({'fullName': fullName, 'id': id}, 'kalejdoskop', {expiresIn: '7d'});
};