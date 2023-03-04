const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app/server')
const connectDB = require('../db/connect')
// Assertion Style
chai.use(chaiHttp)

describe('Ecommerce API', async () => {
    before(async () => {
        await connectDB(process.env.MONGO_URI)
    })

    console.log('AUTH ROUTE')
    // Test register route
    describe("POST /register", function () {
        it("Should error 400 if name, email, password, phone or address not provide", async () => {
            const user = {
                email: "vendor2@example.com",
                password: "123456",
                phone: "0123456789",
                address: "HoChiMinh"
            }
            const res = await chai.request(server).post("/auth/register").send(user)

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Please provide name, email, password, phone & address')
        })
        it("Should error 400 if email already exist", async () => {
            const user = {
                name: "abc",
                email: "vendor2@example.com",
                password: "123456",
                phone: "0123456789",
                address: "HoChiMinh"
            }
            const res = await chai.request(server).post("/auth/register").send(user)

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Email already exists')
        })
    })
    // Test login route
    describe("POST /login", function () {
        it("Should error 400 if email, password not provide", async () => {
            const user = {
                email: "vendor2@example.com"
            }
            const res = await chai.request(server).post("/auth/login").send(user)

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Please provide email & password')
        })
        it("Should error 400 if email already exist", async () => {
            const user = {
                email: "asdsada@example.com",
                password: "123456"
            }
            const res = await chai.request(server).post("/auth/login").send(user)

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Email not register. Please register by this email and login again')
        })
        it("Should error 401 if password not match", async () => {
            const user = {
                email: "vendor2@example.com",
                password: "aaaaaa"
            }
            const res = await chai.request(server).post("/auth/login").send(user)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Pasword not match. Please re-check password')
        })
    })
    // Test forgotPassword route
    describe("POST /forgotPassword", function () {
        it("Should error 400 if email not provide", async () => {
            const user = {
                email: "vendor2qqq@example.com"
            }
            const res = await chai.request(server).post("/auth/forgotPassword").send(user)

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found user with this email')
        })
    })
    // Test changePassword route
    describe("POST /changePassword", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const user = {
                curPassword: "123456",
                newPassword: "654231"
            }
            const res = await chai.request(server).patch("/auth/changePassword").send(user)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should error 400 if current password & new password not provide", async () => {
            const user = {
                newPassword: "654231"
            }
            const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODAzMzcsImV4cCI6MTY4MDI3MjMzN30.03hQuqvsH8dEo-jv16YNvXXw70jAiYNWnu9JzhlkclE"
            const res = await chai.request(server)
                .patch("/auth/changePassword")
                .auth(accessToken, { type: 'bearer' })
                .send(user)

            expect(res.status).to.equal(400)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Please provide current password & new password')
        })
        it("Should error 401 if current password not match", async () => {
            const user = {
                curPassword: "123456",
                newPassword: "654231"
            }
            const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODAzMzcsImV4cCI6MTY4MDI3MjMzN30.03hQuqvsH8dEo-jv16YNvXXw70jAiYNWnu9JzhlkclE"
            const res = await chai.request(server)
                .patch("/auth/changePassword")
                .auth(accessToken, { type: 'bearer' })
                .send(user)

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Pasword not match. Please re-check password')
        })
        it("Should change password success", async () => {
            const user = {
                curPassword: "654231",
                newPassword: "654321"
            }
            const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODAzMzcsImV4cCI6MTY4MDI3MjMzN30.03hQuqvsH8dEo-jv16YNvXXw70jAiYNWnu9JzhlkclE"
            const res = await chai.request(server)
                .patch("/auth/changePassword")
                .auth(accessToken, { type: 'bearer' })
                .send(user)

            expect(res.status).to.equal(200)
            expect(res.body).to.a('object')
            expect(res.body.message).to.equal('Change password success, please log in with new password')
        })
    })
    // Test forgotPassword route
    describe("POST /forgotPassword", function () {
        it("Should error 400 if email not provide", async () => {
            const user = {
                email: "vendor2qqq@example.com"
            }
            const res = await chai.request(server).post("/auth/forgotPassword").send(user)

            expect(res.status).to.equal(404)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Not found user with this email')
        })
    })
    // Test logout route
    describe("POST /logout", function () {
        it("Should error 401 if req not attach header authorization", async () => {
            const res = await chai.request(server).patch("/auth/logout")

            expect(res.status).to.equal(401)
            expect(res.body).to.a('object')
            expect(res.body.msg).to.equal('Authentication invalid')
        })
        it("Should logout success", async () => {
            const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2ZhNTRjM2QwYjUzOTI3ZTRjODRhN2UiLCJpYXQiOjE2Nzc2ODAzMzcsImV4cCI6MTY4MDI3MjMzN30.03hQuqvsH8dEo-jv16YNvXXw70jAiYNWnu9JzhlkclE"
            const res = await chai.request(server)
                .patch("/auth/logout")
                .auth(accessToken, { type: 'bearer' })

            expect(res.status).to.equal(200)
            expect(res.body).to.a('string')
            expect(res.body).to.equal('Logout success')
        })
    })
})
