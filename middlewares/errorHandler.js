const CustomError = require('../lib/errors/customError');

module.exports = (err, req, res, next) => {
    let responseErr = err instanceof CustomError ? err : null;
    if(err.status && typeof err.status === 'number') {
        responseErr = new CustomError();
        responseErr.httpCode = err.status;
        responseErr.name = err.name;
        responseErr.message = err.message;
    };

    let jsonRes = {
        success: false,
        error: responseErr.name,
        message: responseErr.message,
    };

    res.status(responseErr.httpCode).json(jsonRes);
};
