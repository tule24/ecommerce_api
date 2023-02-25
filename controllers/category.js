const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const { catchAsync } = require('../helpers')
const Category = require('../models/Category')
const { APIFeatures } = require('../helpers')

const createCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body
    if (!name || !description) {
        throw new BadRequestError('Please provide category name & description')
    }

    const category = await Category.findOne({ name })
    if (category) {
        throw new BadRequestError('Category already exists')
    } else {
        const newCategory = await Category.create({ name, slug: slugify(name) })
        res.status(StatusCodes.CREATED).json({
            success: true,
            newCategory
        })
    }
})

const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const { name, description } = req.body

    if (!name || !description) {
        throw new BadRequestError('Please provide category name & description')
    } else {
        const category = await Category.findOne({ name })
        if (category) {
            throw new BadRequestError('Category name already exists')
        } else {
            const newCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            if (!newCategory) {
                throw new NotFoundError(`Not found category with id ${id}`)
            } else {
                sendCategoryInfo(res, newCategory)
            }
        }
    }
})

const getAllCategory = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Category.find(), req.query)
        .filter()
        .sort()
        .select()
        .pagination()

    const categories = await features.query
    res.status(StatusCodes.OK).json({
        success: true,
        total: categories.length,
        data: categories
    })
})

const getCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) {
        throw new NotFoundError(`Not found category with id ${id}`)
    } else {
        sendCategoryInfo(res, category)
    }
})

const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)
    if (!category) {
        throw new NotFoundError(`Not found category with id ${id}`)
    } else {
        sendCategoryInfo(res, category)
    }
})

const sendCategoryInfo = (res, category) => {
    res.status(StatusCodes.OK).json({
        success: true,
        data: category
    })
}
module.exports = { createCategory, updateCategory, getAllCategory, getCategory, deleteCategory }
