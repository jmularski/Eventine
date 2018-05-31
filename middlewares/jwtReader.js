const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    const token = req.headers['X-Token'];
    jwt.verify(token, 'kalejdoskop', (err, decoded) => {
        if(err) res.status(401).send({success: false, message: "Your token is bad."});
        else req.token = decoded;
    });
}