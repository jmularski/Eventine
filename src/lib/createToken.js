const jwt = require('jsonwebtoken');
module.exports = (fullName, id) => {
    jwt.sign({'fullName': fullName, 'id': id}, 'kalejdoskop', {expiresIn: '7d'});
}
