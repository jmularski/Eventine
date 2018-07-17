module.exports = (req, res, next) => {
    let err = new Error('Page is missing!');
    err.status = 404;
    next(err);
};
