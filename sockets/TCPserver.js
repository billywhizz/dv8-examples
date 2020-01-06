const { Socket, TCP } = library('socket', {})
const { start, stop } = require('../common/meter.js')

const server = new Socket(TCP)

function onConnect () {
  const client = new Socket(TCP)
  const buf = Buffer.alloc(64 * 1024)
  client.buffer = buf

  client.setup(buf, buf)
  client.onClose(() => {
    stop(client)
  })

  client.onRead(bytes => {
    const r = client.write(bytes)
    if (r === bytes) return
    if (r < 0) return client.close()
    if (r < bytes) return client.pause()
  })

  client.onDrain(() => {
    client.resume()
  })

  client.onEnd(() => {
    client.close()
  })

  client.name = 'client'
  start(client)
  gc()
  server.close(0) // only accept one connection
  return client
}

server.onConnect(onConnect)

server.listen('0.0.0.0', 3001)
