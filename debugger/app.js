const dbg = require('../debugger/debug.js')
dbg.start()
let counter = 0
process.timer = setInterval(() => {
  counter++
  print(counter)
}, 1000)
