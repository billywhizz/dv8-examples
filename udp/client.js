const { UDP } = library('udp', {})
const { lookup } = require('./dns.js')

async function run (name) {
  const port = 4444
  const result = await lookup('api.billywhizz.io')
  const { message } = result
  const { answer } = message
  const [record] = answer
  const { ip } = record
  const server = ip.join('.')
  const sock = new UDP()
  const [rb, wb] = [Buffer.alloc(4096), Buffer.alloc(4096)]
  sock.setup(rb, wb)
  sock.onClose(() => print('close'))
  sock.onSend(() => print('onSend'))
  let running = false
  sock.onMessage((len, address, port) => {
    const message = rb.read(0, len)
    if (!running && (address === server)) {
      const db = JSON.parse(message)
      for (const key of Object.keys(db)) {
        if (key !== name) {
          const { address, port } = db[key]
          setInterval(() => {
            sock.send(wb.write(`hello ${key} from ${name}`, 0), address, port)
          }, 1000)
          running = true
          break
        }
      }
    } else {
      print(`message from ${address}:${port}, ${len}\n${message}`)
    }
  })
  sock.bind('0.0.0.0', 5555)
  sock.start()
  sock.send(wb.write(name, 0), server, port)
  process.loop.run()
}

run(process.args[2]).catch(err => print(`Error: ${err.message}`))
