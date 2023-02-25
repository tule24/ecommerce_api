const { StatusCodes } = require('http-status-codes')
const crypto = require('crypto')
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../errors')
const { catchAsync, createJWT, checkPassword, createPasswordResetToken, sendEmail } = require('../helpers')
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

    const checkPass = await checkPassword(password, user.password)
    if (!checkPass) {
        throw new UnauthorizedError('Pasword not match. Please re-check password')
    }

    sendUserInfo(res, user)
})

const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw new NotFoundError(`Not found user with this email`)
    }

    const { resetToken, passwordResetToken, passwordResetExpires } = await createPasswordResetToken()
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`
    const message = `Foget your password? Submit a PATCH request with your new password and confirmPassword to: ${resetUrl} \n If didn't forget your password, please ignor this email`

    user.passwordResetToken = passwordResetToken
    user.passwordResetExpires = passwordResetExpires
    await user.save()

    await sendEmail({
        email,
        subject: "Your password reset token (Valid for 10 min)",
        message
    })

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Reset token sent to email"
    })
})

const resetPassword = catchAsync(async (req, res, next) => {
    const hashToken = crypto.createHash("sha256").update(req.params.token).digest('hex')
    const user = await User.findOne({ passwordResetToken: hashToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) {
        throw new Error("Reset token is invalid or has expired")
    }

    user.password = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Reset password success, please log in with new password"
    })
})

const changePassword = catchAsync(async (req, res, next) => {
    const { _id } = req.user
    const user = await User.findById(_id)

    if (!user) {
        throw new NotFoundError(`Not found user with this id`)
    }

    const { curPassword, newPassword } = req.body
    if (!curPassword || !newPassword) {
        throw new BadRequestError('Please provide current password & new password')
    }

    const checkPass = await checkPassword(curPassword, user.password)
    if (!checkPass) {
        throw new UnauthorizedError('Pasword not match. Please re-check password')
    }

    user.password = newPassword
    user.passwordChangedAt = Date.now()
    await user.save()

    res.status(StatusCodes.OK).json({
        success: true,
        message: "Change password success, please log in with new password"
    })
})

const sendUserInfo = (res, user) => {
    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        },
        token: createJWT(user._id)
    })
}

module.exports = { register, login, forgotPassword, resetPassword, changePassword }