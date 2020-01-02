const debug = require('./debug.js')

const { Socket, TCP } = library('socket', {})
const server = new Socket(TCP)
const read = Buffer.alloc(64 * 1024)
const write = Buffer.alloc(64 * 1024)
const bytes = new Uint8Array(read.bytes)
let off = 0
let records = 0
let resLength = 0
const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nServer: dv8\r\nDate: ${(new Date()).toUTCString()}\r\nContent-Length: 13\r\n\r\nHello, World!`
while (1) {
  resLength = write.write(response, off)
  off += resLength
  records++
  if (off + resLength > write.size) break
}
let rps = 0
global.t1 = setInterval(() => {
  print(`mem: ${process.memoryUsage().rss}, rps: ${rps}`)
  rps = 0
}, 1000)
server.onConnect(() => {
  const client = new Socket(TCP)
  let lastByte = 0
  let lineLength = 0
  client.setup(read, write)
  client.onClose(() => {})
  client.onRead(len => {
    let off = 0
    let byte = 0
    let requests = 0
    while (len--) {
      byte = bytes[off++]
      lineLength++
      if (byte === 10 && lastByte === 13) {
        if (lineLength === 2) {
          requests++
          if (requests === records) {
            rps += requests
            client.write(requests * resLength)
            requests = 0
          }
        }
        lineLength = 0
      }
      lastByte = byte
    }
    if (requests > 0) {
      rps += requests
      client.write(requests * resLength)
      requests = 0
    }
  })
  client.onDrain(() => client.resume())
  client.onEnd(() => client.close())
  return client
})
server.listen('0.0.0.0', 3000)

debug.start()
