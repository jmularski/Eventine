let blockedIp = [];
module.exports = (req, res, next) => {
    if(req.url.includes('php') || blockedIp.includes(req.ip)){
        if(!blockedIp.includes(res.ip)) blockedIp.push(req.ip);
        res.status(200).send(`Your ip is ${req.ip} and has been reported to Police.`);
    } else {
        next();
    }
};