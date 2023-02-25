const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { catchAsync } = require('../helpers')
const Order = require('../models/Order')

const createOrder = catchAsync(async (req, res, next) => {

})

const updateOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body
    const order = Order.findByIdAndUpdate(id, status, { new: true, runValidators: true })
    if (!order) {
        throw new NotFoundError(`Not found order with id ${id}`)
    } else {
        res.status(StatusCodes.OK).json({
            success: true,
            order
        })
    }
})

const getOrdersOfBuyer = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ buyer: req.user._id }).populate('products', "-photo").populate("buyer", "name")
    res.status(StatusCodes.OK).json({
        success: true,
        orders
    })
})

const getAllOrder = catchAsync(async (req, res, next) => {
    const orders = await Order.find().populate('products', "-photo").populate("buyer", "name").sort({ createdAt: "-1" })
    res.status(StatusCodes.OK).json({
        success: true,
        orders
    })
})

const deleteOrder = catchAsync(async (req, res, next) => {

})

module.exports = { createOrder, updateOrder, getOrdersOfBuyer, getAllOrder, deleteOrder }
