const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app/server')
const connectDB = require('../db/connect')
// Assertion Style
chai.use(chaiHttp)

describe('PRODUCT API', async () => {
    before(async () => {
        await connectDB(process.env.MONGO_URI)
    })
    const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTBiMjQwYzdkMWUzY2M5ZmQ0OTYiLCJpYXQiOjE2Nzc2ODM4NjQsImV4cCI6MTY4MDI3NTg2NH0.vNZHCEQFSElQV7QiHb2inbvvxPYaowyRK4FWkOeIQzk'
    const admin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODQ3NzIsImV4cCI6MTY4MDI3Njc3Mn0.dTQTfzGwT9j8BDl7AKSoc_ijb9BbdGwKdOH5w8plitg"
    const vendor = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTBlZTQwYzdkMWUzY2M5ZmQ0OWYiLCJpYXQiOjE2Nzc2ODg4MzMsImV4cCI6MTY4MDI4MDgzM30.JmyHHIljlZk1Q-UbGSRTIyy6ROk7zFO8bM47BD4JMY0"
    const vendor2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZmODNmYTVjZDBlZGM1NzAxOGM1ZDEiLCJpYXQiOjE2Nzc2ODk4NjYsImV4cCI6MTY4MDI4MTg2Nn0.bv5dV-ipbPkzyWzuFk-zB4PCqNRmq3GzAS6pMzQY9XE"
    // Test getAll
    describe("GET /api/v1/product", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).get("/api/v1/product")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should success", async () => {
            const res = await chai.request(server).get("/api/v1/product").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.data).to.a('array')
            expect(res.body.data.length).to.equal(2)
        })
    })
    // Test get
    describe("GET /api/v1/product/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).get("/api/v1/product/63fc567f0e9407ee92c3e49e")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 404 not found product", async () => {
            const res = await chai.request(server).get("/api/v1/product/63fc567f0e9407ee92c3e49a").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found product with id 63fc567f0e9407ee92c3e49a')
        })
        it("Should success", async () => {
            const name = "T-shirt"
            const res = await chai.request(server).get("/api/v1/product/63fc567f0e9407ee92c3e49e").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.data).to.a('object')
            expect(res.body.data.name).to.equal(name)
        })
    })
    // Test create
    describe("POST /api/v1/product", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const data = {
                name: "hat",
                description: "this is hat",
                price: 10,
                category: "63ff74f151a20332fc02fd71",
                stock: 10
            }
            const res = await chai.request(server).post("/api/v1/product").field(data)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 403 if caller not admin or vendor", async () => {
            const data = {
                name: "hat",
                description: "this is hat",
                price: 10,
                category: "63ff74f151a20332fc02fd71",
                stock: 10
            }
            const res = await chai.request(server).post("/api/v1/product").field(data).auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 400 if name or description not provide", async () => {
            const data = {
                description: "this is hat",
                price: 10,
                category: "63ff74f151a20332fc02fd71",
                stock: 10
            }
            const res = await chai.request(server).post("/api/v1/product").field(data).auth(vendor, { type: 'bearer' })

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Please provide name, description, price, category, stock & photo')
        })
        it("Should success", async () => {
            const data = {
                name: 'hat',
                description: "this is hat",
                price: 10,
                category: "63ff74f151a20332fc02fd71",
                stock: 10
            }
            const res = await chai.request(server)
                                .post("/api/v1/product")
                                .field(data)
                                .attach('photo', './test/test.png', 'test.png')
                                .auth(vendor, { type: 'bearer' })
            expect(res.status).to.equal(201)
            expect(res.body.product).to.a('object')
            console.log(res.body)
        })
    })
    // Test update
    describe("PATCH /api/v1/product/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const data = {
                price: 50
            }
            const res = await chai.request(server)
                .patch("/api/v1/product/63ff8252044b2a3c7038460b")
                .field(data)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 403 if caller not admin or vendor", async () => {
            const data = {
                price: 50
            }
            const res = await chai.request(server)
                .patch("/api/v1/product/63ff8252044b2a3c7038460b")
                .field(data)
                .auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 404 if caller not owner", async () => {
            const data = {
                price: 50
            }
            const res = await chai.request(server)
                .patch("/api/v1/product/63ff8252044b2a3c7038460b")
                .field(data)
                .auth(vendor2, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found product with id 63ff8252044b2a3c7038460b created by vendor-2')
        })
        it("Should success", async () => {
            const data = {
                price: 50
            }
            const res = await chai.request(server)
                .patch("/api/v1/product/63ff8252044b2a3c7038460b")
                .field(data)
                .auth(vendor, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.data).to.a('object')
            expect(res.body.data.price).to.equal(50)
        })
    })
    // Test delete
    describe("PATCH /api/v1/product/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server)
                .delete("/api/v1/product/63ff8252044b2a3c7038460b")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 403 if caller not admin or vendor", async () => {
            const res = await chai.request(server)
                .delete("/api/v1/product/63ff8252044b2a3c7038460b")
                .auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 404 if caller not owner", async () => {
            const res = await chai.request(server)
                .delete("/api/v1/product/63ff8252044b2a3c7038460b")
                .auth(vendor2, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found product with id 63ff8252044b2a3c7038460b created by vendor-2')
        })
        it("Should success", async () => {
            const res = await chai.request(server)
                .delete("/api/v1/product/63ff8252044b2a3c7038460b")
                .auth(vendor, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.data).to.a('object')
            expect(res.body.data._id).to.equal('63ff8252044b2a3c7038460b')
        })
    })
})
