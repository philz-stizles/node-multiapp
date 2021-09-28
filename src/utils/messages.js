exports.generateMessage = message => {
  return {
    message,
    createdAt: new Date().getTime(),
  }
}
