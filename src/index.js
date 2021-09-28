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
const chalk = require('chalk')
const socketIo = require('socket.io')
const Filter = require('bad-words')
const { v4: uuidV4 } = require('uuid')
const app = require('./app')
const { generateMessage } = require('./utils/messages')

const server = http.createServer(app)

// let count = 0;

// TODO:
// Let users pick from list of active rooms or type in custom room name.

const io = socketIo(server)
io.on('connection', socket => {
  socket.emit('message', generateMessage('Welcome to the chat room'))

  socket.broadcast.emit('message', generateMessage('A new user joined'))

  socket.on('sendMessage', (message, ackCallback) => {
    const filter = new Filter()

    if (filter.isProfane(message)) {
      return ackCallback('Profanity is not allowed')
    }

    io.emit('message', generateMessage(message))

    // ackCallback('Delivered') // as many arguments as you want
    ackCallback('Delivered') // as many arguments as you want
  })

  socket.on('sendLocation', (location, ackCallback) => {
    const { latitude, longitude } = location
    io.emit(
      'locationMessage',
      generateMessage(`https://google.com/maps?q=${latitude},${longitude}`)
    )

    ackCallback('Sent')
  })

  socket.on('disconnect', () => {
    // io.emit('message', { message: 'A user disconnected' })
    socket.broadcast.emit('message', generateMessage('A user disconnected'))
  })

  // socket.on('add', () => {
  //     count++
  //     io.emit('countUpdated', { count })
  // })

  // socket.on('minus', () => {
  //     count--
  //     io.emit('countUpdated', { count })
  // })
})

const PORT = process.env.PORT
server.listen(PORT, err => {
  if (err) {
    console.log(
      chalk.white.bgRed.bold(` Multitasker Server could not start!!! `)
    )
  } else {
    console.log(
      chalk.black.bgGreen.bold(` Multitasker Server running on ${PORT}!!! `)
    )
  }
})
