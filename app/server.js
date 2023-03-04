require('dotenv').config()
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('../db/connect')
const { errorHandleMiddleware, notFoundMiddleware, authMiddleware } = require('../middlewares')
const authRouter = require('../routes/auth')
const userRouter = require('../routes/user')
const categoryRouter = require('../routes/category')
const productRouter = require('../routes/product')
const orderRouter = require('../routes/order')

const app = express()
app.use(express.json())
app.use(cors())
// app.use(morgan("dev"))

const publicPathDirectory = path.join(__dirname, '../public')
app.use(express.static(publicPathDirectory))

app.use('/auth', authRouter)
app.use('/user', authMiddleware, userRouter)
app.use('/category', authMiddleware, categoryRouter)
app.use('/product', authMiddleware, productRouter)
app.use('/order', authMiddleware, orderRouter)


app.use(notFoundMiddleware)
app.use(errorHandleMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()

// module.exports = app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`)
// })