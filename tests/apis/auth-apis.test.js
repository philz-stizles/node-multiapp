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

test('Should login an existing user', async () => {
    const response = await supertest(app).post('/api/auth/login').send({
        email: mockedExistingUser.email,
        password: mockedExistingUser.password
    }).expect(200)

    const { data } = response.body
    
    expect(response.body).toMatchObject({
        status: true,
        data: {
            loggedInUser: {
                
            },
            token: data.token
        }
    })

    const user = await User.findById(data.loggedInUser._id)
    expect(user.tokens[1].token).toBe(data.token)
})

test('Should not login a non-existent user', async () => {
    await supertest(app)
        .post('/api/auth/login')
        .send({
            email: 'wrongemail@somemail.com',
            password: 'wrongpassword'
        })
        .expect(400)
})


