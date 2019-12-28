const { setSecure, addContext } = require('../common/tls.js')
const { Socket, TCP } = library('socket', {})

const buf = Buffer.alloc(16384)
const sock = new Socket(TCP)

sock.onConnect(() => {
  const client = new Socket(TCP)
  client.onClose(() => {
    print('closed')
  })
  client.onEnd(() => client.close())
  client.onError((code, message) => {
    print(code)
    print(message)
  })
  client.onRead(len => {
    print(buf.read(0, len))
  })
  client.setup(buf, buf)
  setSecure(client)
  return client
})

const timer = setInterval(() => {
  print(JSON.stringify(process.memoryUsage().rss))
}, 1000)
addContext('dv8.billywhizz.io')

sock.listen('0.0.0.0', 3000)
