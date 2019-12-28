const { Socket, UNIX } = library('socket', {})
const { start, stop } = require('../common/meter.js')

const len = 64 * 1024
let maxBytes = 0
let seconds = parseInt(process.args[2] || '5', 10)

function onConnect () {
  const r = client.write(len)
  if (r === len) return
  if (r < 0) return client.close()
  if (r < len) return client.pause()
}

const buf = Buffer.alloc(len)
const client = new Socket(UNIX)

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

client.setup(buf, buf)

client.onConnect(onConnect)

const r = client.connect('./UNIX.sock')
if (r !== 0) throw new Error(`connect: ${r}`)
client.name = 'client'
start(client)

const timer = setInterval(() => {
  seconds--
  if (seconds === 0) {
    clearTimeout(timer)
    client.close()
  }
}, 1000)
