function foo () {
  setTimeout(() => {
    throw new Error('Error inside Module')
  }, 1000)
}

module.exports = { foo }
