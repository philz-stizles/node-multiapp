// npm install express mongoose validator multer bcryptjs jsonwebtoken cloudinary socket.io @sendgrid/mail chalk(customize console text)
// npm install --save-dev env-cmd(Setting environment variables can be a huge pain coz each OS has a different way to get it done.
// env-cmd allows us to get this done in a cross OS compatible way which means your project will work 
// on Windows, Linux, Mac and Linux distros. Restart you r app whenever you add a variable to the dev.env file)
// npm install --save-dev nodemon eslint
// https://httpstatuses.com
// npm install --save-dev supertest
// SETTING UP TESTING
// "test": "env-cmd -f ./config/test.env jest",  // Don't forget to load test env variables for tests
// configure package.json with jest configs
// "jest": { // Jest default environment is a browser-like jsdom, you can use the node service to use a node-like environment instead
//     "testEnvironment": "node"
// },
// 
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express()

// Connect to DB
require('./db/mongoose').initialize((mongoose))

const publicDirectoryPath = path.join(__dirname, 'public') // files in the public older would be accessible e.g.
// http://localhost:%PORT% => http://localhost:5000 => public/index.html
// http://localhost/%PORT%/%page%.html => http://localhost/5000/about.html => public/about.html
app.use(express.static(publicDirectoryPath))

// Configure application/json parsing
app.use(express.json())

// Web Page Routes
app.get('/about', (req, res) => {
    res.send('Hello About Me')
})

// API Routes
app.use('/api/auth', require('./routes/auth-routes'))
app.use('/api/tasks', require('./routes/task-routes'))
app.use('/api/users', require('./routes/user-routes'))
app.use('/api/weather', require('./routes/weather-routes'))

// app.get('*', (req, res) => {
//     res.render(path.join('public/index.html'))
// })

app.use('*', (err, req, res, next) => {
    res.status(400).send({ status: false, message: err.message })
})

module.exports = app