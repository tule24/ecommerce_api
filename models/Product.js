const { Schema, model } = require('mongoose')

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true })

module.exports = model('products', productSchema)
