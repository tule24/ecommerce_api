const express = require('express')
const { createCategory, updateCategory, getAllCategory, getCategory, deleteCategory } = require('../controllers/category')
const { isAllowedMiddleware } = require('../middlewares')
const router = express.Router()

router.route('/').get(getAllCategory).post(isAllowedMiddleware(["admin"]), createCategory)
router.route('/:id').get(getCategory).patch(isAllowedMiddleware(["admin"]), updateCategory).delete(isAllowedMiddleware(["admin"]), deleteCategory)
module.exports = router