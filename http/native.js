const { Socket, TCP } = library('socket', {})
const { HTTPParser } = require('../common/HTTPParser.js')

const server = new Socket(TCP)
const read = Buffer.alloc(64 * 1024)
const write = Buffer.alloc(64 * 1024)
let resLength = write.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nServer: dv8\r\nDate: ${(new Date()).toUTCString()}\r\nContent-Length: 13\r\n\r\nHello, World!`, 0)
const parsers = []

const createParser = () => {
  if (parsers.length) return parsers.shift()
  return new HTTPParser(HTTPParser.REQUEST)
}

function onConnect () {
  const client = new Socket(TCP)
  const parser = createParser()
  parser[HTTPParser.kOnMessageComplete] = () => {
    const r = client.write(resLength)
    if (r === resLength) return
    if (r < 0) return client.close()
    if (r < resLength) return client.pause()
  }
  client.setup(read, write)
  client.onClose(() => {
    parser.finish()
    parsers.push(parser)
  })
  client.onRead(len => parser.execute(read, 0, len))
  client.onDrain(() => client.resume())
  client.onEnd(() => client.close())
  return client
}

server.onConnect(onConnect)
const r = server.listen('0.0.0.0', 3001)
if (r !== 0) throw new Error(`listen: ${r}`)
global.t1 = setInterval(() => {
  print(`mem: ${process.memoryUsage().rss}, parsers: ${parsers.length}`)
}, 1000)
