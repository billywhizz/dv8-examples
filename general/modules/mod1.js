const { bar } = require('./mod2.js')
module.exports = { bar: {}, foo: () => `module 1.${bar()}` }

require('../../common/buffers.js')
const meter = require('../../common/meter.js')
const path = require('../../common/path.js')
const percentile = require('../../common/percentile.js')
const tls = require('../../common/tls.js')
