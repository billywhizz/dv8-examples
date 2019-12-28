const dbg = require('../debugger/debug.js')
process.pid = process.PID
process.version = 'v10.16.0'
process.arch = 'x64'
dbg.start()
let counter = 0
process.timer = setInterval(() => {
  counter++
  print(counter)
}, 1000)
