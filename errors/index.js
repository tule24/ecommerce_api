const CustomAPIError = require('./customError')
const BadRequestError = require('./badRequest')
const NotFoundError = require('./notFound')
const UnauthorizedError = require('./unauthorized')
const IsAllowedError = require('./isAllowed')

module.exports = { CustomAPIError, BadRequestError, NotFoundError, UnauthorizedError, IsAllowedError }