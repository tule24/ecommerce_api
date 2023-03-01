const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app/server')
const connectDB = require('../db/connect')
// Assertion Style
chai.use(chaiHttp)

describe('ORDER ROUTE', async () => {
    before(async () => {
        await connectDB(process.env.MONGO_URI)
    })
    const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTBiMjQwYzdkMWUzY2M5ZmQ0OTYiLCJpYXQiOjE2Nzc2ODM4NjQsImV4cCI6MTY4MDI3NTg2NH0.vNZHCEQFSElQV7QiHb2inbvvxPYaowyRK4FWkOeIQzk'
    const admin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODQ3NzIsImV4cCI6MTY4MDI3Njc3Mn0.dTQTfzGwT9j8BDl7AKSoc_ijb9BbdGwKdOH5w8plitg"
    const vendor = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTBlZTQwYzdkMWUzY2M5ZmQ0OWYiLCJpYXQiOjE2Nzc2ODg4MzMsImV4cCI6MTY4MDI4MDgzM30.JmyHHIljlZk1Q-UbGSRTIyy6ROk7zFO8bM47BD4JMY0"
    const vendor2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZmODNmYTVjZDBlZGM1NzAxOGM1ZDEiLCJpYXQiOjE2Nzc2ODk4NjYsImV4cCI6MTY4MDI4MTg2Nn0.bv5dV-ipbPkzyWzuFk-zB4PCqNRmq3GzAS6pMzQY9XE"

    // Test getAll
    // describe("GET /api/v1/order", function () {
    //     it("Should error 401 if req not attach header authorization", async () => {
    //         const res = await chai.request(server).get("/api/v1/order")

    //         expect(res.status).to.equal(401)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('Authentication invalid')
    //     })
    //     it("Should error 403 if caller not admin", async () => {
    //         const res = await chai.request(server).get("/api/v1/order").auth(auth, { type: 'bearer' })

    //         expect(res.status).to.equal(403)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('You have not permission to access this route')
    //     })
    //     it("Should success", async () => {
    //         const res = await chai.request(server).get("/api/v1/order").auth(admin, { type: 'bearer' })

    //         expect(res.status).to.equal(200)
    //         expect(res.body.orders).to.a('array')
    //         expect(res.body.orders.length).to.equal(1)
    //     })
    // })
    // Test create
    // describe("POST /api/v1/order", function () {
    //     it("Should error 401 if req not attach header authorization", async () => {
    //         const data = {
    //             products: [],
    //             total: 500
    //         }
    //         const res = await chai.request(server).post("/api/v1/order").send(data)

    //         expect(res.status).to.equal(401)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('Authentication invalid')
    //     })
    //     it("Should error 400 if products or total not provide", async () => {
    //         const data = {
    //             products: [],
    //             total: 500
    //         }
    //         const res = await chai.request(server).post("/api/v1/order").send(data).auth(auth, { type: 'bearer' })

    //         expect(res.status).to.equal(400)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('Please prodide products & total')
    //     })
    //     it("Should error 400 if product id not exist", async () => {
    //         const data = {
    //             products: [
    //                 {
    //                     product: "63fc567f0e9407ee92c3e49a",
    //                     quantity: 5
    //                 }
    //             ],
    //             total: 500
    //         }
    //         const res = await chai.request(server).post("/api/v1/order").send(data).auth(auth, { type: 'bearer' })

    //         expect(res.status).to.equal(400)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('Product with id 63fc567f0e9407ee92c3e49a not exist')
    //     })
    //     it("Should error 400 if product out of stock", async () => {
    //         const data = {
    //             products: [
    //                 {
    //                     product: "63fc567f0e9407ee92c3e49e",
    //                     quantity: 100
    //                 }
    //             ],
    //             total: 500
    //         }
    //         const res = await chai.request(server).post("/api/v1/order").send(data).auth(auth, { type: 'bearer' })

    //         expect(res.status).to.equal(400)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('Product with id 63fc567f0e9407ee92c3e49e out of stock')
    //     })
    //     it("Should success", async () => {
    //         const data = {
    //             products: [
    //                 {
    //                     product: "63fc567f0e9407ee92c3e49e",
    //                     quantity: 10
    //                 },
    //                 {
    //                     product: "63fc56a10e9407ee92c3e4a1",
    //                     quantity: 20
    //                 }
    //             ],
    //             total: 200
    //         }
    //         const productBefore_1 = await chai.request(server).get("/api/v1/product/63fc567f0e9407ee92c3e49e").auth(auth, { type: 'bearer' })
    //         const productBefore_2 = await chai.request(server).get("/api/v1/product/63fc56a10e9407ee92c3e4a1").auth(auth, { type: 'bearer' })

    //         const res = await chai.request(server).post("/api/v1/order").send(data).auth(auth, { type: 'bearer' })

    //         expect(res.status).to.equal(201)
    //         expect(res.body).to.a('object')
    //         expect(res.body.order.products.length).to.equal(2)
    //         expect(res.body.order.total).to.equal(200)

    //         const productAfter_1 = await chai.request(server).get("/api/v1/product/63fc567f0e9407ee92c3e49e").auth(auth, { type: 'bearer' })
    //         const productAfter_2 = await chai.request(server).get("/api/v1/product/63fc56a10e9407ee92c3e4a1").auth(auth, { type: 'bearer' })

    //         const diff_stock_1 = productBefore_1.body.data.stock - productAfter_1.body.data.stock
    //         const diff_stock_2 = productBefore_2.body.data.stock - productAfter_2.body.data.stock
    //         const diff_order_1 = productAfter_1.body.data.orders.length - productBefore_1.body.data.orders.length
    //         const diff_order_2 = productAfter_2.body.data.orders.length - productBefore_2.body.data.orders.length

    //         expect(diff_stock_1).to.equal(10)
    //         expect(diff_stock_2).to.equal(20)
    //         expect(diff_order_1).to.equal(1)
    //         expect(diff_order_2).to.equal(1)
    //     })
    // })
    // Test getOrdersOfBuyer
    // describe("GET /api/v1/order/buyer", function () {
    //     it("Should error 401 if req not attach header authorization", async () => {
    //         const res = await chai.request(server).get("/api/v1/order/buyer")

    //         expect(res.status).to.equal(401)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('Authentication invalid')
    //     })
    //     it("Should success", async () => {
    //         const res = await chai.request(server).get("/api/v1/order/buyer").auth(auth, { type: 'bearer' })

    //         expect(res.status).to.equal(200)
    //         expect(res.body.orders).to.a('array')
    //         expect(res.body.orders.length).to.equal(2)
    //     })
    // })
    // Test getOrdersOfProduct
    // describe("GET /api/v1/order/product/:id", function () {
    //     it("Should error 401 if req not attach header authorization", async () => {
    //         const res = await chai.request(server).get("/api/v1/order/product/63fc567f0e9407ee92c3e49e")

    //         expect(res.status).to.equal(401)
    //         expect(res.body).to.a('object')
    //         expect(res.body.msg).to.equal('Authentication invalid')
    //     })
    //     it("Should success", async () => {
    //         const res = await chai.request(server).get("/api/v1/order/product/63fc567f0e9407ee92c3e49e").auth(auth, { type: 'bearer' })

    //         expect(res.status).to.equal(200)
    //         expect(res.body.orders).to.a('object')
    //         expect(res.body.orders.orders.length).to.equal(3)
    //     })
    // })
    // Test cancel
    describe("GET /api/v1/order/product/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const data = {
                status: "Cancelled"
            }
            const res = await chai.request(server).patch("/api/v1/order/63ff8e9679989e14c0ee3363").send(data)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 401 if caller not admin or vendor", async () => {
            const data = {
                status: "Cancelled"
            }
            const res = await chai.request(server).patch("/api/v1/order/63ff8e9679989e14c0ee3363").send(data).auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 404 if order not found", async () => {
            const data = {
                status: "Cancelled"
            }
            const res = await chai.request(server).patch("/api/v1/order/63ff8e9679989e14c0ee3364").send(data).auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found order with id 63ff8e9679989e14c0ee3364')
        })
        it("Should success", async () => {
            const data = {
                status: "Cancelled"
            }

            const productBefore_1 = await chai.request(server).get("/api/v1/product/63fc567f0e9407ee92c3e49e").auth(admin, { type: 'bearer' })
            const productBefore_2 = await chai.request(server).get("/api/v1/product/63fc56a10e9407ee92c3e4a1").auth(admin, { type: 'bearer' })

            const res = await chai.request(server).patch("/api/v1/order/63ff8e9679989e14c0ee3363").send(data).auth(admin, { type: 'bearer' })

            const productAfter_1 = await chai.request(server).get("/api/v1/product/63fc567f0e9407ee92c3e49e").auth(admin, { type: 'bearer' })
            const productAfter_2 = await chai.request(server).get("/api/v1/product/63fc56a10e9407ee92c3e4a1").auth(admin, { type: 'bearer' })

            const diff_stock_1 = productAfter_1.body.data.stock - productBefore_1.body.data.stock
            const diff_stock_2 = productAfter_2.body.data.stock - productBefore_2.body.data.stock

            expect(diff_stock_1).to.equal(10)
            expect(diff_stock_2).to.equal(20)

            expect(res.status).to.equal(200)
            expect(res.body.order).to.a('object')
            expect(res.body.order._id).to.equal("63fc567f0e9407ee92c3e49e")
        })
    })
})
