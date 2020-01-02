const { UDP } = library('udp', {})
const sock = new UDP()
const [rb, wb] = [Buffer.alloc(4096), Buffer.alloc(4096)]
sock.setup(rb, wb)
sock.onClose(() => print('close'))
sock.onSend(() => print('onSend'))
const db = {}
sock.onMessage((len, address, port) => {
  const name = rb.read(0, len)
  print(`${name}: ${address}:${port}`)
  db[name] = { address, port }
  for (const key of Object.keys(db)) {
    const { address, port } = db[key]
    sock.send(wb.write(JSON.stringify(db), 0), address, port)
  }
})
sock.bind('0.0.0.0', 4444)
sock.start()
