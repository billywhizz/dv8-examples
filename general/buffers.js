const { buf2b64, buf2hex, hex2buf, b642buf, buf2binary, pprint } = require('../common/buffers.js')

// strings to/from base64
let b
let b64 = ''
let hex = ''

b = Buffer.fromString('hello')
print(b.size)
print(b.bytes.byteLength)
print(b.read(0, b.size))
b64 = buf2b64(b, b.size)
print(b64)

b = b642buf(b64)
print(b.size)
print(b.bytes.byteLength)
print(b.read(0, b.size))
b64 = buf2b64(b, b.size)
print(b64)

// strings to/from hex
b = Buffer.fromString('hello')
print(b.size)
print(b.bytes.byteLength)
print(b.read(0, b.size))
hex = buf2hex(b, b.size)
print(hex)

b = hex2buf(hex)
print(b.size)
print(b.bytes.byteLength)
print(b.read(0, b.size))
hex = buf2hex(b, b.size)
print(hex)

// binary to/from base64

// binary to/from hex

