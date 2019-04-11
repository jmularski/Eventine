// What is the reason for this middleware? 
// Lots of chinese bots pinging our server to search for php vulnerabilities
// Blocked all IPs requesting for *php* ¯\_(ツ)_/¯

let blockedIp = [];
module.exports = (req, res, next) => {
    if(req.url.includes('php') || blockedIp.includes(req.ip)) {
        if(!blockedIp.includes(res.ip)) blockedIp.push(req.ip);
        res.status(200).send(`Your ip is ${req.ip}.`);
    } else {
        next();
    }
};
