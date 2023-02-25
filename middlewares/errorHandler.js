const { StatusCodes } = require('http-status-codes')
const { CustomAPIError } = require('../errors')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    }

    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }

    if (err.name = 'ValidationError') {
        customError.statusCode = StatusCodes.BAD_REQUEST
        customError.msg = Object.values(err.errors).map(item => item.message).join('')
    }

    if (err.code && err.code === 11000) {
        customError.statusCode = StatusCodes.BAD_REQUEST
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    }

    // if (err.name = "CastError") {
    //     customError.statusCode = StatusCodes.BAD_REQUEST
    //     customError.msg = err.message
    // }

    res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware