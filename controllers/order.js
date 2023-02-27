const { Types } = require('mongoose')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { catchAsync } = require('../helpers')
const Order = require('../models/Order')
const Product = require('../models/Product')

const createOrder = catchAsync(async (req, res, next) => {
    const { products, total } = req.body
    if (products.length === 0 || !total) {
        throw new BadRequestError("Please prodide products, total & buyer")
    }

    const newProducts = []
    for (let i = 0; i < products.length; i++) {
        const product = await Product.findById(products[i].product)
        if (!product) {
            throw new BadRequestError(`Product with id ${products[i].product} not exist`)
        } else {
            const newStock = product.stock - products[i].quantity
            if (newStock < 0) {
                throw new BadRequestError(`Product with id ${products[i].product} not exist`)
            } else {
                product.stock = newStock
                product.amount = products[i].quantity
                newProducts.push(product)
            }
        }
    }

    const order = await Order.create({ products, total, buyer: req.user._id })
    Promise.all(newProducts.map(async (product) => {
        product.orders.push({
            order: order._id,
            amount: product.amount
        })
        delete product.amount
        return await product.save()
    }))
    res.status(StatusCodes.CREATED).json({
        success: true,
        order
    })
})

const updateOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findById(id)
    if (!order) {
        throw new NotFoundError(`Not found order with id ${id}`)
    }

    const products = order.products
    if (status === 'Cancelled') {
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].product)
            const newStock = product.stock + products[i].quantity
            product.stock = newStock
            await product.save()
        }
    }

    order.status = status
    await order.save()
    res.status(StatusCodes.OK).json({
        success: true,
        order
    })
})

const getOrdersOfBuyer = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ buyer: req.user._id }).populate({ path: "products.product", select: "name description price", populate: { path: "vendor", select: "name email phone address" } }).populate("buyer", "name").sort({ createdAt: "-1" })
    res.status(StatusCodes.OK).json({
        success: true,
        orders
    })
})

const getOrdersOfProduct = catchAsync(async (req, res, next) => {
    const { pid } = req.params
    const orders = await Product
        .findById(pid)
        .select("name description price stock")
        .populate({ path: "orders.order", select: "quantity status", populate: { path: "buyer", select: "name email phone address" } })

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

module.exports = { createOrder, updateOrder, getOrdersOfBuyer, getAllOrder, getOrdersOfProduct }
