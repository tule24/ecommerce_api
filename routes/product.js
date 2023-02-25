const express = require('express')
const { createProduct, updateProduct, getAllProduct, getProduct, deleteProduct, getProductPhoto } = require('../controllers/product')
const { authMiddleware, isAdmin } = require('../middlewares')
const formidableMiddleware = require('express-formidable')

const router = express.Router()

router.route('/').get(getAllProduct).post(authMiddleware, isAdmin, createProduct)
router.route('/:slug').get(getProduct).patch(authMiddleware, isAdmin, updateProduct).delete(authMiddleware, isAdmin, deleteProduct)
router.route('/photo/:pid').get(getProductPhoto)

module.exports = router