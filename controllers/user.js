const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../errors')
const { catchAsync } = require('../helpers')
const User = require('../models/User')

const updateUser = catchAsync(async (req, res, next) => {
    const { password } = req.body
    if (password) {
        throw new BadRequestError("This route is not used to update the password")
    }

    const { email } = req.body
    if (email) {
        const user = await User.findOne({ email })
        if (user) {
            throw new BadRequestError('Email already exists')
        }
    }

    const { id } = req.params
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    sendUserInfo(res, user)
})

const getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
        throw new NotFoundError(`Not found user with this ${id}`)
    }

    sendUserInfo(res, user)
})

const getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.status(StatusCodes.OK).json({
        total: users.length,
        users
    })
})

const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)
    if (!user) {
        throw new NotFoundError(`Not found user with this ${id}`)
    }
    sendUserInfo(res, user)
})

const sendUserInfo = (res, user) => {
    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        }
    })
}

module.exports = { updateUser, getUser, getAllUser, deleteUser }