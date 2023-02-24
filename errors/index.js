const CustomAPIError = require('./customError')
const BadRequestError = require('./badRequest')
const NotFoundError = require('./notFound')
const UnauthorizedError = require('./unauthorized')

module.exports = { CustomAPIError, BadRequestError, NotFoundError, UnauthorizedError }