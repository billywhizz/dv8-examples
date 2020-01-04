
setTimeout(() => {
  throw new Error('Timer Callback Error')
}, 1000)

function fail () {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Promise Rejected Error')), 1000)
  })
}

fail()

fail().catch(err => {
  print(err.stack)
})

try {
  throw new Error('Main Scope Handled Error')
} catch (err) {
  print(err.stack)
}

const { foo } = require('./mod.js')
foo()

throw new Error('Main Scope Error')
