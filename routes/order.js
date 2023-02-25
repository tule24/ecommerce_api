const express = require('express')
const {  } = require('../controllers/order')
const { authMiddleware, isAdmin } = require('../middlewares')
const router = express.Router()

router.route('/').get(getAllOrder).post(authMiddleware, createCategory)
router.route('/:id').get(getCategory).patch(authMiddleware, updateCategory).delete(authMiddleware, deleteCategory)
module.exports = router