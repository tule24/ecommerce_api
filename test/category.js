const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app/server')
const connectDB = require('../db/connect')
// Assertion Style
chai.use(chaiHttp)

describe('CATEGORY API', async () => {
    before(async () => {
        await connectDB(process.env.MONGO_URI)
    })
    const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTBiMjQwYzdkMWUzY2M5ZmQ0OTYiLCJpYXQiOjE2Nzc2ODM4NjQsImV4cCI6MTY4MDI3NTg2NH0.vNZHCEQFSElQV7QiHb2inbvvxPYaowyRK4FWkOeIQzk'
    const admin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODQ3NzIsImV4cCI6MTY4MDI3Njc3Mn0.dTQTfzGwT9j8BDl7AKSoc_ijb9BbdGwKdOH5w8plitg"

    // Test getAll
    describe("GET /api/v1/category", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).get("/api/v1/category")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should success", async () => {
            const res = await chai.request(server).get("/api/v1/category").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.data).to.a('array')
            expect(res.body.data.length).to.equal(1)
        })
    })
    // Test get
    describe("GET /api/v1/category/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).get("/api/v1/category/63fa6307dc8132ef5308560e")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 404 not found category", async () => {
            const res = await chai.request(server).get("/api/v1/category/63fa6307dc8132ef5308560a").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found category with id 63fa6307dc8132ef5308560a')
        })
        it("Should success", async () => {
            const catgory = {
                _id: "63fa6307dc8132ef5308560e",
                name: "clothes",
                description: "this is clothes"
            }
            const res = await chai.request(server).get("/api/v1/category/63fa6307dc8132ef5308560e").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.category).to.a('object')
            delete res.body.category.createdAt
            delete res.body.category.updatedAt
            delete res.body.category.__v
            expect(res.body.category).to.deep.equal(catgory)
        })
    })
    // Test create
    describe("POST /api/v1/category", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const data = {
                name: "bag",
                description: "this is bag"
            }
            const res = await chai.request(server).post("/api/v1/category").send(data)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 403 if caller not admin", async () => {
            const data = {
                name: "bag",
                description: "this is bag"
            }
            const res = await chai.request(server).post("/api/v1/category").send(data).auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 400 if name or description not provide", async () => {
            const data = {
                name: "bag"
            }
            const res = await chai.request(server).post("/api/v1/category").send(data).auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Please provide category name & description')
        })
        it("Should error 400 if category name already exist", async () => {
            const data = {
                name: "clothes",
                description: "this is bag"
            }
            const res = await chai.request(server).post("/api/v1/category").send(data).auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Category already exists')
        })
        it("Should success", async () => {
            const data = {
                name: "bag",
                description: "this is bag"
            }
            const res = await chai.request(server).post("/api/v1/category").send(data).auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(201)
            expect(res.body.newCategory).to.a('object')
            delete res.body.newCategory._id
            delete res.body.newCategory.createdAt
            delete res.body.newCategory.updatedAt
            delete res.body.newCategory.__v
            expect(res.body.newCategory).to.deep.equal(data)
        })
    })
    // Test update
    describe("PATCH /api/v1/category/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const data = {
                name: "hat",
                description: "this is hat"
            }
            const res = await chai.request(server).patch("/api/v1/category/63ff74f151a20332fc02fd71").send(data)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 403 if caller not admin", async () => {
            const data = {
                name: "hat",
                description: "this is hat"
            }
            const res = await chai.request(server).patch("/api/v1/category/63ff74f151a20332fc02fd71").send(data).auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 404 if category nout found", async () => {
            const data = {
                name: "hat",
                description: "this is hat"
            }
            const res = await chai.request(server).patch("/api/v1/category/63ff74f151a20332fc02fd72").send(data).auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found category with id 63ff74f151a20332fc02fd72')
        })
        it("Should error 400 if category name already exist", async () => {
            const data = {
                name: "clothes",
                description: "this is hat"
            }
            const res = await chai.request(server).patch("/api/v1/category/63ff74f151a20332fc02fd71").send(data).auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Category already exists')
        })
        it("Should success", async () => {
            const data = {
                name: "hat",
                description: "this is hat"
            }
            const res = await chai.request(server).patch("/api/v1/category/63ff74f151a20332fc02fd71").send(data).auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.category).to.a('object')
            data._id = "63ff74f151a20332fc02fd71"
            delete res.body.category.createdAt
            delete res.body.category.updatedAt
            delete res.body.category.__v
            expect(res.body.category).to.deep.equal(data)
        })
    })
    // Test delete
    describe("DELETE /api/v1/category/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).delete("/api/v1/category/63ff74f151a20332fc02fd71")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 403 if caller not admin", async () => {
            const res = await chai.request(server).delete("/api/v1/category/63ff74f151a20332fc02fd71").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 404 if category nout found", async () => {
            const res = await chai.request(server).delete("/api/v1/category/63ff74f151a20332fc02fd72").auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found category with id 63ff74f151a20332fc02fd72')
        })
        it("Should success", async () => {
            const res = await chai.request(server).patch("/api/v1/category/63ff74f151a20332fc02fd71").auth(admin, { type: 'bearer' })

            const catgory = {
                _id: "63ff74f151a20332fc02fd71",
                name: "hat",
                description: "this is hat"
            }
            expect(res.status).to.equal(200)
            expect(res.body.category).to.a('object')
            delete res.body.category.createdAt
            delete res.body.category.updatedAt
            delete res.body.category.__v
            expect(res.body.category).to.deep.equal(catgory)
        })
    })
})
