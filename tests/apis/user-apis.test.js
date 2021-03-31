const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/User')
const app = require('./../../src/app')

const mockedUserId = new mongoose.Types.ObjectId
const mockedExistingUser = {
    _id: mockedUserId,
    username: "exisitngtestuser",
    email: "exisitngtestuser@somemail.com",
    password: "123456",
    tokens: [{ token: jwt.sign({ _id: mockedUserId }, process.env.JWT_SECRET) }],
    status: "m"
}

const testAuthToken = `Bearer ${mockedExistingUser.tokens[0].token}`

beforeEach(async () => {
    // Clear the User DB to have a clean slate
    await User.deleteMany()
    await new User(mockedExistingUser).save()
})

afterEach(() => {

})

test('Should signup a new user', async () => {
    const response = await supertest(app).post('/api/users').send({
        username: "philz.stizlesn",
        email: "philz.stizlesn@gmail.com",
        password: "123456",
        status: "m"
    }).expect(201)

    expect(response.body).toMatchObject({
        status: true,
        data: {
            username: "philz.stizlesn",
            email: "philz.stizlesn@gmail.com"
        }
    })
})

test('Should return authenticated users profile', async () => {
    await supertest(app)
        .get('/api/users/me')
        .set('Authorization', testAuthToken)
        .send()
        .expect(200)
})

test('Should not return profile for unauthenticated users', async () => {
    await supertest(app)
        .get('/api/users/me')
        .send()
        .expect(401)
})

test('Should delete account for unauthenticated users', async () => {
    await supertest(app)
        .delete('/api/users/me')
        .set('Authorization', testAuthToken)
        .send()
        .expect(200)

    const user = await User.findById(mockedExistingUser._id)
    expect(user).toBeNull() 
})

test('Should not delete account for unauthenticated users', async () => {
    await supertest(app)
        .delete('/api/users/me')
        .send()
        .expect(401)
})



