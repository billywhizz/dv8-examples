const { Socket, TCP } = library('socket', {})
const { start, stop } = require('../common/meter.js')

const server = new Socket(TCP)
const stats = {
  backend: { send: 0, recv: 0 },
  client: { send: 0, recv: 0 }
}

server.onConnect(() => {
  const client = new Socket(TCP)
  const backend = new Socket(TCP)
  client.name = 'client'
  backend.name = 'backend'
  const buf = Buffer.alloc(64 * 1024)
  client.setup(buf, buf)
  backend.setup(buf, buf)
  client.buffer = buf
  client.onEnd(() => client.close())
  client.onClose(() => {
    stop(client)
    backend.close()
  })
  client.onRead(bytes => {
    stats.client.recv += bytes
    const r = backend.write(bytes)
    if (r >= 0) stats.backend.send += r
    if (r < 0) return backend.close()
    if (r < bytes) return client.pause()
  })
  backend.onRead(bytes => {
    stats.backend.recv += bytes
    const r = client.write(bytes)
    if (r >= 0) stats.client.send += r
    if (r < 0) return client.close()
    if (r < bytes) return backend.pause()
  })
  backend.onDrain(() => client.resume())
  client.onDrain(() => backend.resume())
  backend.onEnd(() => backend.close())
  backend.onConnect(() => {
    start(backend)
    client.resume()
  })
  backend.connect('0.0.0.0', 3001)
  server.close(0) // only accept one connection
  process.nextTick(() => client.pause())
  backend.onClose(() => {
    stop(backend)
    clearTimeout(server.timer)
  })
  start(client)
  return client
})

server.listen('0.0.0.0', 3000)

server.timer = setInterval(() => {
  const mem = process.memoryUsage()
  const all = process.activeHandles()
  const summary = {}
  all.filter(h => h.active).forEach(h => {
    if (summary[h.type]) return summary[h.type]++
    summary[h.type] = 1
  })
  print(JSON.stringify({ rss: mem.rss, stats, summary }, null, '  '))
  stats.backend.recv = stats.backend.send = 0
  stats.client.recv = stats.client.send = 0
}, 1000)
