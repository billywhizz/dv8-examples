function threadMain () {
  const { bar } = require('./mod2.js')
  setTimeout(() => {
    print(`module 3 done: ${bar()}`)
    throw new Error('Error from Thread')
  }, 3000)
}

module.exports = { spawn: () => process.spawn(threadMain, () => {}, { ipc: false }) }
