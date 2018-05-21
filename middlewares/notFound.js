module.exports = (req, res, next) => {
    var err = new Error("Page is missing!");
    err.status = 404;
    next(err);
};