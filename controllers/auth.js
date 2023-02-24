const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../errors')
const { catchAsync, createJWT, checkPassword } = require('../helpers')
const User = require('../models/User')

const register = catchAsync(async (req, res, next) => {
    const { name, email, password, phone, address } = req.body
    if (!name || !email || !password || !phone || !address) {
        throw new BadRequestError('Please provide name, email, password, phone & address')
    }

    const user = await User.findOne({ email })
    if (user) {
        throw new BadRequestError('Email already exists')
    } else {
        const newUser = await User.create(req.body)
        res.status(StatusCodes.CREATED).json({
            user: {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                address: newUser.address
            }
        })
    }
})

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email & password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new NotFoundError('Email not register. Please register by this email and login again')
    }

    let checkPass = await checkPassword(password, user.password)
    if (!checkPass) {
        throw new UnauthorizedError('Pasword not match. Please re-check password')
    }

    sendUserInfo(res, user)
})

const forgotPassword = catchAsync(async (req, res, next) => {
    const { email, answer, newPassword } = req.body
    if (!email || !answer || !newPassword) {
        throw new BadRequestError('Please provide email, answer & new password')
    }

    const user = await User.findOne({ email, answer })
    if (!user) {
        throw new NotFoundError('Wrong email or answer')
    } else {
        user.password = newPassword
        await user.save()
        res.status(StatusCodes.OK).json({
            message: "Password reset successfully"
        })
    }
})

const sendUserInfo = (res, user) => {
    res.status(StatusCodes.OK).json({
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        },
        token: createJWT(user._id)
    })
}

module.exports = { register, login, forgotPassword }