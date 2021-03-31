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
const http = require('http')
const chalk = require('chalk');
const socketIo = require('socket.io')
const app = require('./app')


const server = http.createServer(app);

// let count = 0;

const io = socketIo(server);
io.on('connection', socket => {
    socket.emit('message', { message: 'Welcome to the chat room' })

    socket.broadcast.emit('message', { message: 'A new user joined' })

    socket.on('sendMessage', (message) => {
        io.emit('message', { message })
    })

    socket.on('disconnect', () => {
        // io.emit('message', { message: 'A user disconnected' })
        socket.broadcast.emit('message', { message: 'A user disconnected' }) 
    })

    // socket.on('add', () => {
    //     count++
    //     io.emit('countUpdated', { count })
    // })

    // socket.on('minus', () => {
    //     count--
    //     io.emit('countUpdated', { count })
    // })
});

const PORT = process.env.PORT
server.listen(PORT, (err) => {
    if(err) {
        console.log(chalk.white.bgRed.bold(` Multitasker Server could not start!!! `))
    } else {
        console.log(chalk.black.bgGreen.bold(` Multitasker Server running on ${PORT}!!! `))
    }
    
})