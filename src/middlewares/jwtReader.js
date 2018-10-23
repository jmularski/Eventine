const jwt = require('jsonwebtoken');
const decryptToken = require('../lib/decryptToken');
module.exports = (req, res, next) => {
    const token = req.headers['x-token'];
    req.token = decryptToken(token);
    next();
};
