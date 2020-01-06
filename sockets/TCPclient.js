const { Socket, TCP } = library('socket', {})
const { start, stop } = require('../common/meter.js')
const len = 64 * 1024
let maxBytes = 0
const count = parseInt(process.args[2] || '100000', 10) * (64 * 1024)
let send = 0
let recv = 0
function onConnect () {
  const r = client.write(len)
  send += len
  if (r === len) return
  if (r < 0) return client.close()
  if (r < len) return client.pause()
}
const buf = Buffer.alloc(len)
const client = new Socket(TCP)
client.onClose(() => stop(client))
client.onRead(bytes => {
  if (bytes > maxBytes) maxBytes = bytes
  recv += bytes
  if (recv >= count && send >= count && (recv === send)) {
    client.close()
    return
  }
  if (send >= count) return
  const r = client.write(bytes)
  send += bytes
  if (r === bytes) return
  if (r < 0) return client.close()
  if (r < bytes) return client.pause()
})
client.onDrain(() => client.resume())
client.setup(buf, buf)
client.buffer = buf
client.onConnect(onConnect)
client.connect('0.0.0.0', 3001)
client.name = 'client'
start(client)
gc()
