require('dotenv').config()
const express = require('express')
const path = require('path')
const morgan = require('morgan')


const app = express()
app.use(express.json())

const publicPathDirectory = path.join(__dirname, '../public')
app.use(express.static(publicPathDirectory))

const port = process.env.PORT || 3000
const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()