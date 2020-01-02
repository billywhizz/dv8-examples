// throw new Error('Main Scope')

setTimeout(() => {
  throw new Error('Inside Callback')
}, 1000)

function fail () {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Promise Rejection')), 1000)
  })
}

fail()

fail().catch(err => {
  print(err.stack)
})

try {
  throw new Error('Caught Exception')
} catch (err) {
  print(err.stack)
}

const { foo } = require('./mod.js')
foo()
