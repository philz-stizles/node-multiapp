const users = []

exports.addUser = ({ id, username, room }) => {
  // Sanitize data.
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate data.
  if (!username || !room) {
    return {
      error: 'username and room are required',
    }
  }

  // Validate username.
  const existingUser = users.find(
    user => user.username === username && user.room === room
  )
  if (existingUser) {
    return {
      error: 'username is already in use',
    }
  }

  // Add user to store.
  users.push({ id, username: username, room: room })
}

exports.removeUser = () => {}

exports.getUser = () => {}

exports.getUsersInRoom = () => {}
