function threadMain () {
  const { Socket, TCP } = library('socket', {})
  const { HTTPParser, REQUEST } = library('httpParser', {})

  const parsers = []
  const read = Buffer.alloc(64 * 1024)
  const write = Buffer.alloc(64 * 1024)
  const server = new Socket(TCP)

  const resLength = write.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nServer: dv8\r\nDate: ${(new Date()).toUTCString()}\r\nContent-Length: 13\r\n\r\nHello, World!`, 0)

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
      const r = client.write(resLength)
      if (r === resLength) return
      if (r < 0) return client.close()
      if (r < resLength) return client.pause()
    })
    client.setup(read, write)
    client.onClose(() => parsers.push(parser))
    client.onDrain(() => client.resume())
    client.onEnd(() => client.close())
    parser.reset(REQUEST, client)
    return client
  }

  server.onConnect(onConnect)
  server.listen('0.0.0.0', 3000)
}

let workers = parseInt(process.args[2] || '1')

global.t1 = setInterval(() => {
  const { threads } = process
  const { rss } = process.memoryUsage()
  print(JSON.stringify({ rss, threads: Object.keys(threads).length }))
}, 1000)

while (workers--) {
  process.spawn(threadMain, result => {
    const { err, thread } = result
    if (err) {
      print(err.message)
    }
    print(`thread ${thread.id} done`)
  }, { ipc: false })
}
