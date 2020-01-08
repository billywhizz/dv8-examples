/*
const buf = Buffer.empty()
const str = 'hello'
const ab = buf.alloc(str.length, false)
buf.write(str)
print(ab.byteLength)
const bytes = new Uint8Array(ab)
const view = new DataView(ab)
print(bytes)
const b64 = buf.encode(0, buf.size())
print(b64)
const out = Buffer.empty()
out.alloc(b64.length, false)
const size = out.decode(b64, 0)
//print(size)
*/
/*
const str = Buffer.fromString(args[2] || 'hello')
print(`String Length   : ${str.size}`)
print(`String Value    : ${str.read(0, str.size)}`)
const encoded = Buffer.empty()
let len = str.encode(0, str.size, encoded)
print(`Encoded Length  : ${len}`)
print(`Encoded Value   : ${encoded.read(0, len)}`)
const decoded = Buffer.empty()
len = encoded.decode(decoded, 0)
print(`Decoded Length  : ${len}`)
print(`Decoded Value   : ${decoded.read(0, len)}`)

Reflect.getPrototypeOf(x.bytes).constructor.name
*/

class FakeBuffer {
  constructor (buf) {
    this.buffer = buf
  }

  read (off = 0, len = this.buffer.size) {
    this.buffer.read(off, len)
    return this
  }

  encode (buf) {
    this.buffer.encode(0, this.buffer.size, buf.buffer)
    return this
  }

  decode (buf) {
    this.buffer.decode(buf.buffer, 0)
    return this
  }
}

FakeBuffer.fromString = str => {
  return new FakeBuffer(Buffer.fromString(str))
}

FakeBuffer.empty = () => {
  return new FakeBuffer(Buffer.empty())
}

const answer = FakeBuffer
  .fromString(args[2] || 'hello')
  .encode(FakeBuffer.empty())
  .decode(FakeBuffer.empty())
  .read()

print(answer)
