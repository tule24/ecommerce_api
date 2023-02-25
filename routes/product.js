const express = require('express')
const { createProduct, updateProduct, getAllProduct, getProduct, deleteProduct, getProductPhoto } = require('../controllers/product')
const { isAllowedMiddleware } = require('../middlewares')
const formidableMiddleware = require('express-formidable')

const router = express.Router()

router.route('/').get(getAllProduct).post(isAllowedMiddleware(['vendor', 'admin']), formidableMiddleware(), createProduct)
router.route('/:id').get(getProduct).patch(isAllowedMiddleware(['vendor', 'admin']), formidableMiddleware(), updateProduct).delete(isAllowedMiddleware(['vendor', 'admin']), deleteProduct)
router.route('/photo/:id').get(getProductPhoto)

module.exports = router