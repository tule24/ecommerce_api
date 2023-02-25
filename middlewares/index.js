const notFoundMiddleware = require('./notFound')
const errorHandleMiddleware = require('./errorHandler')
const { authMiddleware, isAllowedMiddleware } = require('./auth')
module.exports = { notFoundMiddleware, errorHandleMiddleware, authMiddleware, isAllowedMiddleware }

