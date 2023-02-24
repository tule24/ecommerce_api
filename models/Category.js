const { Schema, model } = require('mongoose')

const categorySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase: true,
    }
})

module.exports = model('categories', categorySchema)
