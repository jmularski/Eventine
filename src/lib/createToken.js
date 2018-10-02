const jwt = require('jsonwebtoken');
module.exports = () => {
    jwt.sign({'fullName': fullName, 'id': id}, 'kalejdoskop', {expiresIn: '7d'});
}
