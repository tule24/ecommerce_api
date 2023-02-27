const express = require('express')
const { createOrder, updateOrder, getOrdersOfBuyer, getAllOrder, getOrdersOfProduct } = require('../controllers/order')
const { isAllowedMiddleware } = require('../middlewares')
const router = express.Router()

router.route('/').get(isAllowedMiddleware(['admin']), getAllOrder).post(createOrder)
router.route('/buyer').get(getOrdersOfBuyer)
router.route('/product/:pid').get(getOrdersOfProduct)
router.route('/:id').patch(isAllowedMiddleware(['admin', 'vendor']), updateOrder)
module.exports = router