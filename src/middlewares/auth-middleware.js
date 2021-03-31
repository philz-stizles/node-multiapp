const jwt = require('jsonwebtoken')

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })
        if(!user) {
            throw new Error()
        }

        // Attach the token to the current request for use in the route handler/controller e.g for logout
        // to detach token from stored tokens(In multi-device login strategy)
        req.token = token;

        // Attach the user to the current request for use in the route handler/controller.
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).send({ status: false, data: req.body, message: 'Please authenticate' })
    }
}

exports.authorize = (...rest) => (req, res, next) => {
    next()
}