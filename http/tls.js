const { Socket, TCP } = library('socket', {})
const { HTTPParser, REQUEST } = library('httpParser', {})
const { setSecure, addContext } = require('../common/tls.js')

const parsers = []
const read = Buffer.alloc(64 * 1024)
const write = Buffer.alloc(64 * 1024)
const server = new Socket(TCP)

let resLength = write.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nServer: dv8\r\nDate: ${(new Date()).toUTCString()}\r\nContent-Length: 13\r\n\r\nHello, World!`, 0)

const createParser = () => {
  if (parsers.length) return parsers.shift()
  const work = Buffer.alloc(4 * 1024)
  const parser = new HTTPParser()
  parser.setup(read, work)
  return parser
}

function onConnect () {
  const client = new Socket(TCP)
  const parser = createParser()
  parser.onHeaders(() => {
    resLength = write.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nServer: dv8\r\nDate: ${(new Date()).toUTCString()}\r\nContent-Length: 13\r\n\r\nHello, World!`, 0)
    const r = client.write(resLength)
    if (r === resLength) return
    if (r < 0) return client.close()
    if (r < resLength) return client.pause()
  })
  client.setup(read, write)
  client.onClose(() => parsers.push(parser))
  client.onDrain(() => client.resume())
  client.onEnd(() => client.close())
  setSecure(client)
  parser.reset(REQUEST, client)
  return client
}

server.onConnect(onConnect)
server.listen('0.0.0.0', 3000)

global.t1 = setInterval(() => {
  print(process.memoryUsage().rss)
}, 1000)

addContext('dv8.billywhizz.io')
