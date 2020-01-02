const { UDP } = library('udp', {})
const sock = new UDP()
const [rb, wb] = [Buffer.alloc(65536), Buffer.alloc(65536)]
sock.rb = rb
sock.wb = wb
const rView = new DataView(rb.bytes)
const wView = new DataView(wb.bytes)
sock.setup(rb, wb)
sock.onClose(() => print('close'))
sock.onSend(() => {})
let size = 0
let blockSize = 512
let rate = 0
let then = 0
let fileName = ''
let remotePort = 0
sock.timer = setInterval(() => {
  print(`size: ${size}, rate: ${rate}, rss: ${process.memoryUsage().rss}, file: ${fileName}, port: ${remotePort}`)
  rate = 0
}, 1000)
sock.onMessage((len, address, port) => {
  remotePort = port
  const opCode = rView.getUint16(0)
  if (opCode === 2) { // Write Request
    let start = 2
    let off = 2
    const parts = []
    while (off < len) {
      if (rView.getUint8(off) === 0) {
        parts.push(rb.read(start, off - start))
        start = off + 1
      }
      off++
    }
    const [, mode] = parts
    if (mode === 'octet') {
      fileName = parts[0]
      if (parts.length > 2 && parts[2] === 'blksize') {
        let pos = 0
        blockSize = parseInt(parts[3], 10)
        wView.setUint16(pos, 6)
        pos += 2
        wb.write(parts[2], pos)
        pos += parts[2].length
        wView.setUint8(pos++, 0)
        wb.write(parts[3], pos)
        pos += parts[3].length
        wView.setUint8(pos++, 0)
        sock.send(pos, address, port)
      } else {
        wView.setUint16(0, 4)
        wView.setUint16(2, 0)
        sock.send(4, address, port)
      }
      then = Date.now()
    }
    size = 0
  } else if (opCode === 3) { // Data
    const blockLen = len - 4
    const blockNum = rView.getUint16(2)
    wView.setUint16(0, 4)
    wView.setUint16(2, blockNum)
    sock.send(4, address, port)
    size += blockLen
    rate += blockLen
    if (blockLen < blockSize) {
      // last block - payload is < 512
      print(`${fileName} received in ${Date.now() - then} ms`)
    } else {
      // normal block
    }
  } else {
    print(`unknown opCode: ${opCode}`)
    print(`len: ${len}, address: ${address}, port: ${port}`)
  }
})
sock.bind('0.0.0.0', 69)
sock.start()
