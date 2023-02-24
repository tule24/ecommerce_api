const express = require('express')
const { createCategory, updateCategory, getAllCategory, getCategory, deleteCategory } = require('../controllers/category')
const { authMiddleware, isAdmin } = require('../middlewares')
const router = express.Router()

router.route('/').get(getAllCategory).post(authMiddleware, isAdmin, createCategory)
router.route('/:id').get(getCategory).patch(authMiddleware, isAdmin, updateCategory).delete(authMiddleware, isAdmin, deleteCategory)
module.exports = router