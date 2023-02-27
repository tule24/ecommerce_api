const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }
    ],
    total: {
        type: Number,
        require: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: String,
        default: "Not process",
        enum: ["Not process", "Processing", "Shipped", "Delivered", "Cancelled"]
    }
}, { timestamps: true })

module.exports = model('orders', orderSchema)
