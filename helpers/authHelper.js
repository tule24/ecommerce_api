const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const checkPassword = async (password, hashedPassword) => {
    const check = await bcrypt.compare(password, hashedPassword)
    return check
}

const createJWT = (userId) => jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
)

module.exports = { checkPassword, createJWT }