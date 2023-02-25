const catchAsync = require('./catchAsync')
const { checkPassword, createJWT, checkPasswordChange, createPasswordResetToken } = require('./authHelper')
const APIFeatures = require('./apiFeatures')
const sendEmail = require('./email')

module.exports = { catchAsync, checkPassword, createJWT, APIFeatures, checkPasswordChange, createPasswordResetToken, sendEmail }