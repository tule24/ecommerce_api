const { StatusCodes } = require('http-status-codes')
const slugify = require('slugify')
const fs = require('fs')
const { BadRequestError, NotFoundError } = require('../errors')
const { catchAsync } = require('../helpers')
const Product = require('../models/Product')
const { APIFeatures } = require('../helpers')

const createProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, category, quantity } = req.fields
    const { photo } = req.files

    if (!name || !description || !price || !category || !quantity || !photo) {
        throw new BadRequestError('Please provide name, description, price, category, quantity & photo')
    }
    if (photo.size > 1000000) {
        throw new BadRequestError('Photo size should be less then 1mb')
    }

    const product = new Product({ ...req.fields, slug: slugify(name) })
    product.photo.data = fs.readFileSync(photo.path)
    product.photo.contentType = photo.type
    await product.save()

    res.status(StatusCodes.CREATED).json({
        success: true,
        product
    })
})

const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { name, description, price, category, quantity } = req.fields
    const { photo } = req.files
    if (photo && photo.size > 1000000) {
        throw new BadRequestError('Photo size should be less then 1mb')
    }
    const newProduct = await Product.findByIdAndUpdate(id, { ...req.fields, slug: slugify(name) }, { new: true, runValidators: true })

    if (!newProduct) {
        throw new NotFoundError(`Not found product with id ${id}`)
    } else {
        if (photo) {
            newProduct.photo.data = fs.readFileSync(photo.path)
            newProduct.photo.contentType = photo.type
        }
        await newProduct.save()
        sendProductInfo(res, newProduct)
    }
})

const getAllProduct = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find().select("-photo"), req.query)
        .filter()
        .sort()
        .select()
        .pagination()

    const products = await features.query
    res.status(StatusCodes.OK).json({
        success: true,
        total: products.length,
        data: products
    })
})

const getProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findById(id).select('-photo').populate('category')
    if (!product) {
        throw new NotFoundError(`Not found product with id ${id}`)
    } else {
        sendProductInfo(res, product)
    }
})

const getProductPhoto = catchAsync(async (req, res, next) => {
    const { pid } = req.params
    const product = await Product.findById(pid).select("photo")
    if (product.photo.data) {
        res.set('Content-type', product.photo.contentType)
        res.status(StatusCodes.OK).send(product.photo.data)
    }

})

const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
        throw new NotFoundError(`Not found product with id ${id}`)
    } else {
        sendProductInfo(res, product)
    }
})

const sendProductInfo = (res, product) => {
    res.status(StatusCodes.OK).json({
        success: true,
        data: product
    })
}
module.exports = { createProduct, updateProduct, getAllProduct, getProduct, deleteProduct, getProductPhoto }
