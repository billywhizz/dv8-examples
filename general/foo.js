function threadMain () {
  const { foo } = require('./modules/mod1.js')
  const { bar, fail } = require('./modules/mod2.js')
  print(foo())
  print(bar())
  fail()
}

process.spawn(threadMain, () => {}, { ipc: false })
