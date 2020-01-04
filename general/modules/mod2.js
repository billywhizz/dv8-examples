const { join } = require('../../common/path.js')
const { start, stop } = require('../../common/meter.js')

module.exports = { bar: () => 'module 2', fail: () => setTimeout(() => { throw new Error('Foo') }, 1000) }
