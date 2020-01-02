const { File, O_RDONLY } = library('fs', {})

function readFileSync (fname) {
  const buf = Buffer.alloc(16384)
  const file = new File()
  file.setup(buf, buf)
  file.open(fname, O_RDONLY)
  const ab = buf.bytes.slice(0, file.read(16384, 0))
  file.close()
  return ab
}

function decodeWasmString (memory, offset, length) {
  const bytes = new Uint8Array(memory.buffer.slice(offset, offset + length))
  const chars = []
  bytes.forEach(b => chars.push(String.fromCharCode(b)))
  return chars.join('')
}

function println (off, len) {
  print(decodeWasmString(memory, off, len))
}

const ab = readFileSync('./fizzbuzz.wasm')
const memory = new WebAssembly.Memory({ initial: 1 })
const mod = new WebAssembly.Module(ab)
const { exports } = new WebAssembly.Instance(mod, { js: { memory, println } })
const { fizzbuzz } = exports

fizzbuzz(parseInt(process.args[2] || '16', 10))
