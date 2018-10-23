const jwt = require('jsonwebtoken');
const decryptToken = require('../lib/decryptToken');
module.exports = (req, res, next) => {
    const token = req.headers['x-token'];
    let result = decryptToken(token);
    if (!result.success) res.status(401).send(result);
    console.log(result)
    req.token = result.token;
};
