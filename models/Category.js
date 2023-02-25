const { Schema, model } = require('mongoose')

const categorySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
})

module.exports = model('categories', categorySchema)
