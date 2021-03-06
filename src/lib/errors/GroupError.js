const CustomError = require('./CustomError');

module.exports = class GroupError extends CustomError {
    constructor(customMessage) {
        super();

        this.name = this.constructor.name;
        this.status = 401;
        this.message = customMessage || 'Error in group creation!';
    }
};
