const CustomError = require('./customError');

module.exports = class NotAuthorized extends CustomError {
    constructor(customMessage) {
        super();

        this.name = this.constructor.name;
        this.status = 401;
        this.message = customMessage || 'Error in authorization!';
    }
};
