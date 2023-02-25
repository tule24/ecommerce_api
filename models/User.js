const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new Schema({
    name: {
        type: String,
        require: [true, "Please tell us your name"],
        minLength: [6, "Name length >= 6"],
        maxLength: [32, "Name length < 32"]
    },
    email: {
        type: String,
        require: [true, "Please provide your email"],
        unique: true,
        validator: [validator.isEmail, "Invalid email"]
    },
    password: {
        type: String,
        require: [true, "Please provide password"]
    },
    phone: {
        type: String,
        require: [true, "Please provide your phone"]
    },
    address: {
        type: String,
        require: [true, "Please provide your address"]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "vendor", "admin"]
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

module.exports = model('users', userSchema)