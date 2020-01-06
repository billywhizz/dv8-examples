const { Socket, TCP } = library('socket', {})
const { start, stop } = require('../common/meter.js')

const server = new Socket(TCP)
let bps = 0

server.onConnect(() => {
  const client = new Socket(TCP)
  const buf = Buffer.alloc(65536)
  client.setup(buf, buf) // set a ref here. on destroy, free the buffer
  client.onClose(() => {
    stop(client)
    clearTimeout(server.timer)
  })
  client.onRead(bytes => {
    bps += bytes
  })
  client.onEnd(() => client.close())
  client.name = 'client'
  client.buffer = buf
  client.setNoDelay(true)
  process.nextTick(() => client.setNoDelay(true))
  start(client, false)
  server.close(0) // only accept one connection
  return client
})

server.timer = setInterval(() => {
  print(bps)
  bps = 0
}, 1000)

server.listen('0.0.0.0', 3001)
