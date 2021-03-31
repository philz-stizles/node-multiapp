const User = require('./../models/User')

exports.signup = async (req, res) => {
    const { username, email, password, status } = req.body

    const newUser = new User({ username, email, password, status })
    try {
        // Create user
        const user = await newUser.save()

        // Generate token
        const token = await user.generateAuthToken()

        return res.status(201).send({ status: true, data: { user, token }, message: 'Created' })
    } catch (error) {
        // console.log(error)
        return res.status(400).send({ status: false, data: error, message: 'Failed' })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        // Validate credentials
        const user = await User.findByCredentials(email, password)

        // Generate token
        const token = await user.generateAuthToken()

        // return res.send({ status: true, data: { 
        //     loggedInUser: user.getPublicProfile(), 
        //     token 
        // }, message: 'You are logged in' })

        return res.send({ status: true, data: { user, token }, message: 'You are logged in' })
    } catch (error) {
        return res.status(400).send({ data: error, message: error.message })
    }
}

exports.logout = async (req, res) => {
    try {
        // - Remove Token Operation: Remove token from currently authenticated users stored tokens
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        // - Save Current User: save currently authenticated user to save remove token operation
        await req.user.save()

        return res.send({ status: true, message: 'You are now logged out' })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.logoutAll = async (req, res) => {
    try {
        // Remove all tokens from currently authenticated users stored tokens
        req.user.tokens = []

        // save currently authenticated user
        await req.user.save()

        return res.send({ status: true, message: 'You are now logged out from all devices' })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}