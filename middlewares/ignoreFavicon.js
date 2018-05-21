module.exports = (req, res, next) => {
    if(req.originalUrl === '/favicon.ico') res.sendStatus(204);
    else next();
}