var socket = io()

// Elements
const $chatForm = document.querySelector('#chatForm')
const $chatFormInput = $chatForm.querySelector('#input')
const $messages = document.querySelector('#messages')
const $chatSendBtn = document.querySelector('#chatSendBtn')
const $sendLocationBtn = document.querySelector('#sendLocationBtn')

// Templates
const messageTemplate = document.querySelector('#message-template')
const locationMessageTemplate = document.querySelector(
  '#location-message-template'
)

// options
const { user, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.emit('join', { user, room }, ack => {})

socket.on('message', ({ message, createdAt }) => {
  console.log(message, createdAt)
  const li = document.createElement('li')
  li.innerText = message
  $messages.appendChild(li)

  // const messageHtml = Mustache.render(messageTemplate, {
  //   message,
  //   createdAt: moment(createdAt).format('h:mm a'),
  // })
  // $messages.insertAdjacentHTML('beforeend', messageHtml)
})

socket.on('locationMessage', ({ message, createdAt }) => {
  console.log(message, createdAt)
  const a = document.createElement('a')
  a.innerText = message
  $messages.appendChild(li)

  // const messageHtml = Mustache.render(locationMessageTemplate, {
  //   message,
  //   createdAt: moment(createdAt).format('h:mm a'),
  // })
  // $messages.insertAdjacentHTML('beforeend', messageHtml)
})

$chatForm.addEventListener('submit', e => {
  e.preventDefault()

  // Disable form button.
  $chatSendBtn.setAttribute('disabled', 'disabled')

  const message = $chatFormInput.value
  console.log($chatFormInput, message)
  $chatFormInput.value = ''
  // socket.emit('sendMessage', message, ack => {
  //   console.log(ack)
  //})

  socket.emit('sendMessage', message, error => {
    // Enable form button.
    $chatSendBtn.removeAttribute('disabled')
    $chatFormInput.focus()
    if (error) {
      console.log(error)
    }

    console.log('Message delivered')
  })
})

$sendLocationBtn.addEventListener('click', e => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }

  $sendLocationBtn.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position)
    const { latitude, longitude } = position.coords
    socket.emit('sendLocation', { latitude, longitude }, () => {
      $sendLocationBtn.removeAttribute('disabled')
      // This callback does not get fired except the ack callback is called on the server-side
      console.log('Location sent')
    })
  })
})
