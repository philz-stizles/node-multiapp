const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./Task')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'Username is required'], unique: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true,
        unique: true,
        validate(value) { 
            if(!validator.isEmail(value)) throw Error('Email is invalid')
        } 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'], 
        minLength: [6, 'password length should be greater than 6'],
        trim: true,
        validate(value) { 
            if(value.toLowerCase().includes('password')) throw Error('Password cannot contain "password"')
        } 
    },
    avatar: { type: Buffer }, // To render this buffer in html <img src="data:image/jpg;base64,%place-binary-data-here%" />
    tokens: [{ token: { type: String, required: true } }],
    status: { type: String, required: true },
    age: { type: Number, required: false, validate(value) { if(value < 0) throw Error('Age must be a positive number')} },
    roles: [{ name: { type: String, enum: ['user', 'admin'],  default: 'user' }, permissions: [] }]
}, { timestamps: true }) // timestamps: true => will automatically create fields for createdAt and updatedAt

UserSchema.pre('save', async function(next) { // Do not use arrow functions here
    const user = this
    // Check if password is defined and modified
    // This middleware is attached to tsave. Thus, ensure that your update strategy is using save() and not update, 
    // else update password with a different API
    if(user.password && user.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt);
    }
    
    next()
})

UserSchema.pre('remove', async function(next) { // Do not use arrow functions here
    const user = this
    
    await Task.deleteMany({ creator: user._id })

    next()
})

UserSchema.virtual('tasks', {
    ref: "Tasks",
    localField: '_id', // local key
    foreignField: 'creator' // Foreign key
})

UserSchema.statics.findByCredentials = async (email, password) => { // You can use arrow functions here as we will not be requiring 
// the this reference
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error('Invalid Credentials')
    }

    const isMatch = await user.comparePassword(password, (isMatch) => isMatch)
    // console.log(isMatch)
    if(!isMatch) {
        throw new Error('Invalid Credentials')
    }

    return user
}

UserSchema.methods.comparePassword = async function(password, callback) {
    return callback(await bcrypt.compare(password, this.password));
};

UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign(
        { _id: user._id.toString() }, 
        process.env.JWT_SECRET, 
        { expiresIn: +process.env.JWT_SECRET_EXPIRESIN } // This has been defined in env variables in seconds 1800 => 30mins
        // + is added to convert it from string to an integer as it will assume milliseconds if string is detected
    )


    // Store current login in DB, this strategy enable a user to login from multiple devices and stay logged unless
    // the user logs out which will logout the current requesting device
    user.tokens = user.tokens.concat({ token })
    await user.save()

    // Return generated token
    return token
};

// UserSchema.methods.getPublicProfile = function() {
//     const user = this

//     // Create an object representation of the user
//     const userObject = user.toObject()
    
//     // Remove private data
//     delete userObject.password
//     delete userObject.tokens

//     // Return public profile
//     return userObject
// };

UserSchema.methods.toJSON = function() {
    const user = this

    // Create a JSON representation of the user
    const userObject = user.toObject()
    
    // Remove private data
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar // Remove avatar here coz the data is large for JSON requests

    // Return public profile
    return userObject
};

module.exports = User = mongoose.model('Users', UserSchema)