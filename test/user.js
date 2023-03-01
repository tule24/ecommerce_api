const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app/server')
const connectDB = require('../db/connect')
// Assertion Style
chai.use(chaiHttp)

describe('USER API', async () => {
    before(async () => {
        await connectDB(process.env.MONGO_URI)
    })
    const auth = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTBiMjQwYzdkMWUzY2M5ZmQ0OTYiLCJpYXQiOjE2Nzc2ODM4NjQsImV4cCI6MTY4MDI3NTg2NH0.vNZHCEQFSElQV7QiHb2inbvvxPYaowyRK4FWkOeIQzk'
    const admin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODQ3NzIsImV4cCI6MTY4MDI3Njc3Mn0.dTQTfzGwT9j8BDl7AKSoc_ijb9BbdGwKdOH5w8plitg"

    // Test get route
    describe("GET /api/v1/user/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).get("/api/v1/user/63fa6e402ad0d5dc5bc2aaac")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 404 not found user", async () => {
            const res = await chai.request(server).get("/api/v1/category").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found user with this 63fa6e402ad0d5dc5bc2aabc')
        })
        it("Should success", async () => {
            const user = {
                id: "63fa6e402ad0d5dc5bc2aaac",
                name: "vendor-2",
                email: "vendor2@example.com",
                phone: "0123456789",
                address: "HoChiMinh"
            }
            const res = await chai.request(server).get("/api/v1/user/63fa6e402ad0d5dc5bc2aaac").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.user).to.a('object')
            expect(res.body.user).to.deep.equal(user)
        })
    })
    // Test getAll route
    describe("GET /api/v1/user", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).get("/api/v1/user")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should success", async () => {
            const res = await chai.request(server).get("/api/v1/user").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body.users).to.a('array')
            expect(res.body.users.length).to.equal(4)
        })
    })
    // Test update route
    describe("PATCH /api/v1/user/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const data = { address: "VungTau" }
            const res = await chai.request(server).patch("/api/v1/user/63fa50ee40c7d1e3cc9fd49f").send(data)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 401 if caller not owner", async () => {
            const data = { address: "VungTau" }
            const res = await chai.request(server).patch("/api/v1/user/63fa50ee40c7d1e3cc9fd49f").send(data).auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Only update the account that you own')
        })
        it("Should error 400 if change email but email already exist", async () => {
            const data = { email: "vendor2@example.com" }
            const res = await chai.request(server).patch("/api/v1/user/63fa50b240c7d1e3cc9fd496yarn").send(data).auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Email already exists')
        })
        it("Should success", async () => {
            const data = { address: "VungTau" }
            const res = await chai.request(server).patch("/api/v1/user/63fa50b240c7d1e3cc9fd496yarn").send(data).auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body).to.a('object')

            const user = {
                id: "63fa50b240c7d1e3cc9fd496",
                name: "user-1",
                email: "user@example.com",
                phone: "0123456789",
                address: "VungTau"
            }
            expect(res.body.user).to.deep.equal(user)
        })
    })
    // Test delete route
    describe("DELETE /api/v1/user/:id", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).delete("/api/v1/user/63fa6e402ad0d5dc5bc2aaac")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 403 if caller not admin", async () => {
            const res = await chai.request(server).delete("/api/v1/user/63fa6e402ad0d5dc5bc2aaac").auth(auth, { type: 'bearer' })

            expect(res.status).to.equal(403)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('You have not permission to access this route')
        })
        it("Should error 404 if user not found", async () => {
            const res = await chai.request(server).delete("/api/v1/user/63fa6e402ad0d5dc5bc2aaab").auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found user with this 63fa6e402ad0d5dc5bc2aaab')
        })
        it("Should success", async () => {
            const res = await chai.request(server).delete("/api/v1/user/63fa6e402ad0d5dc5bc2aaac").auth(admin, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body).to.a('object')

            const user = {
                id: "63fa6e402ad0d5dc5bc2aaac",
                name: "vendor-2",
                email: "vendor2@example.com",
                phone: "0123456789",
                address: "HoChiMinh"
            }
            expect(res.body.user).to.deep.equal(user)
        })
    })
})
