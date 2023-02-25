const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./customError')

class IsAllowedError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

module.exports = IsAllowedError