function threadMain () {
  const { foo } = require('./modules/mod1.js')
  const { bar, fail } = require('./modules/mod2.js')
  const { spawn } = require('./modules/mod3.js')
  print(foo())
  print(bar())
  fail()
  spawn()
}

process.spawn(threadMain, () => {}, { ipc: false })
