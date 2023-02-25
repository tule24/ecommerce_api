const jwt = require('jsonwebtoken')
const { UnauthorizedError, IsAllowedError } = require('../errors')
const User = require('../models/User')
const { catchAsync, checkPasswordChange } = require('../helpers')

const authMiddleware = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthorizedError('Authentication invalid')
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const curUser = await User.findById(decoded.userId)
    if (!curUser) {
        throw new UnauthorizedError('User belonging to this token no longer exist')
    }

    if (checkPasswordChange(curUser.passwordChangedAt, decoded.iat)) {
        throw new UnauthorizedError('User recent changed the password. Please log in again with new password')
    }

    req.user = curUser
    next()
})

const isAllowedMiddleware = (roles) => {
    return catchAsync(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new IsAllowedError("You have not permission to access this route"))
        }
        next()
    })
}

module.exports = { authMiddleware, isAllowedMiddleware }