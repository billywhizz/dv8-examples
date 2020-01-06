const { buf2b64, pprint } = require('../common/buffers.js')
const { readFileSync } = require('../common/fs.js')

// dv8 -e "print(require('../common/buffers.js').buf2b64(Buffer.fromArrayBuffer(require('../common/fs.js').readFileSync('./2373.jpg'))))"
const image = readFileSync('./2373.jpg')
const b64 = buf2b64(image)

print(b64.length)
pprint(new Uint8Array(image.bytes.slice(0, 100)))
print(`${b64.slice(0, 100)}...${b64.slice(b64.length - 100)}`)
/*

markdown for an embedded image

![Hello World](data:image/png;base64,)

*/
