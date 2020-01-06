
function testBuffers (path) {
  const mod = require(path)
  const { buf2b64, buf2hex, hex2buf, b642buf, buf2binary, pprint } = mod
  const b = Buffer.alloc(100)
  pprint(new Uint8Array(b.bytes))
}
function testMeter (path) {
  const mod = require(path)
  const pipe = { name: 'foo', stats: () => new BigUint64Array(20) }
  mod.start(pipe)
  mod.stop(pipe)
}
function testPath (path) {
  const mod = require(path)
  const { join, baseName } = mod
  print(join('/foo/bar', 'baz.js'))
  print(baseName(__filename))
}
function testPercentiles (path) {
  const mod = require(path)
  const { getPercentiles } = mod
  print(JSON.stringify(getPercentiles([1, 3, 4])))
}

function testTLS (path) {
  const mod = require(path)
  const { setSecure, addContext, getContext, deleteContext } = mod
}

testBuffers('../common/buffers.js')
testBuffers(`${process.cwd()}/../common/buffers.js`)
testMeter('../common/meter.js')
testMeter(`${process.cwd()}/../common/meter.js`)
testPath('../common/path.js')
testPath(`${process.cwd()}/../common/path.js`)
testPercentiles('../common/percentile.js')
testPercentiles(`${process.cwd()}/../common/percentile.js`)
testTLS('../common/tls.js')
testTLS(`${process.cwd()}/../common/tls.js`)
