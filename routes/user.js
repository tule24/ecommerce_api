const express = require('express')
const { updateUser, getUser, getAllUser, deleteUser } = require('../controllers/user')
const { isAllowedMiddleware } = require('../middlewares')
const router = express.Router()

router.route('/').get(getAllUser)
router.route('/:id').get(getUser).patch(updateUser).delete(isAllowedMiddleware(["admin"]), deleteUser)

module.exports = router