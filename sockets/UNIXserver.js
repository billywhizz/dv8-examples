const { Socket, UNIX } = library('socket', {})
const { start, stop } = require('../common/meter.js')

const server = new Socket(UNIX)

let maxBytes = 0

function onConnect () {
  const client = new Socket(UNIX)
  const buf = Buffer.alloc(64 * 1024)

  client.setup(buf, buf)
  client.onClose(() => {
    stop(client)
  })

  client.onRead(bytes => {
    if (bytes > maxBytes) maxBytes = bytes
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
  return client
}

server.onConnect(onConnect)

const r = server.listen('./UNIX.sock')
if (r !== 0) throw new Error(`listen: ${r}`)
