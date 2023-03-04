const express = require('express')
const { register, login, forgotPassword, resetPassword, changePassword, refreshToken, logout } = require('../controllers/auth')
const { authMiddleware } = require('../middlewares')
const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/refresh').post(refreshToken)
router.route('/logout').post(authMiddleware, logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:token').patch(resetPassword)
router.route('/changePassword').patch(authMiddleware, changePassword)

module.exports = router