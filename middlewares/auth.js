const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('../errors')
const User = require('../models/User')
const { catchAsync } = require('../helpers')

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

    req.user = curUser
    next()
})

const isAdmin = catchAsync(async (req, res, next) => {
    const user = req.user
    if (user.role !== 'admin') {
        throw new UnauthorizedError('Only admin can access this route')
    } else {
        next()
    }
})

module.exports = { authMiddleware, isAdmin }