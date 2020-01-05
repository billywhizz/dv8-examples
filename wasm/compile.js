const WabtModule = require('./libwabt.min.js')
const { File, O_WRONLY, O_CREAT } = library('fs', {})

process.argv = process.args
process.on = (name, fn) => {
  process[name] = fn
}
console.warn = (data, ...args) => {}

function writeFile (fileName, buf) {
  const file = new File()
  const b = Buffer.fromArrayBuffer(buf.buffer)
  file.setup(b, b)
  file.fd = file.open(fileName, O_CREAT | O_WRONLY)
  file.write(b.size, 0)
  file.close()
}

const features = {
  exceptions: false,
  mutable_globals: false,
  sat_float_to_int: false,
  sign_extension: false,
  simd: true,
  threads: false,
  multi_value: false,
  tail_call: false,
  bulk_memory: false,
  reference_types: false
}

function compile (fileName) {
  return new Promise((resolve, reject) => {
    WabtModule().then(wabt => {
      var module = wabt.parseWat(fileName, readFile(fileName).text, features)
      module.resolveNames()
      module.validate(features)
      const binaryOutput = module.toBinary({ log: true, write_debug_names: false })
      resolve({ wasm: binaryOutput.buffer, source: binaryOutput.log })
    })
  })
}

function evaluate (wasm) {
  const memory = new WebAssembly.Memory({ initial: 1 })
  function decodeWasmString (memory, offset, length) {
    const bytes = new Uint8Array(memory.buffer.slice(offset, offset + length))
    const chars = []
    bytes.forEach(b => chars.push(String.fromCharCode(b)))
    return chars.join('')
  }
  function println (off, len) {
    print(decodeWasmString(memory, off, len))
  }
  const mod = new WebAssembly.Module(wasm)
  return new WebAssembly.Instance(mod, { js: { memory, println } })
}

async function run () {
  let mod = await compile('fizzbuzz.wat')
  writeFile('fizzbuzz.wasm', mod.wasm)
  const { fizzbuzz } = evaluate(mod.wasm).exports
  fizzbuzz(10)
  mod = await compile('addTwo.wat')
  writeFile('addTwo.wasm', mod.wasm)
  const { addTwo } = evaluate(mod.wasm).exports
  print(addTwo(5, 17))
}

run()
