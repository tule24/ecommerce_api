require('dotenv').config()
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const formidableMiddleware = require('express-formidable')
const connectDB = require('../db/connect')
const { errorHandleMiddleware, notFoundMiddleware } = require('../middlewares')
const authRouter = require('../routes/auth')
const categoryRouter = require('../routes/category')
const productRouter = require('../routes/product')

const app = express()
app.use(express.json())
app.use(morgan("dev"))
app.use(formidableMiddleware())

const publicPathDirectory = path.join(__dirname, '../public')
app.use(express.static(publicPathDirectory))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/product', productRouter)

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