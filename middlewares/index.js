const notFoundMiddleware = require('./notFound')
const errorHandleMiddleware = require('./errorHandler')
const { authMiddleware, isAdmin } = require('./auth')
module.exports = { notFoundMiddleware, errorHandleMiddleware, authMiddleware, isAdmin }

