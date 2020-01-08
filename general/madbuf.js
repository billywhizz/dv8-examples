function replacer (k, v) {
  if (typeof v === 'bigint') {
    return v.toString()
  }
  return v
}

let runs = parseInt(args[2] || '4')

function fillBuffer (buf, val) {
  let off = 0
  const step = 1024 * 1024
  const { size, bytes } = buf
  const dv = new DataView(bytes)
  return new Promise(resolve => {
    function next () {
      let end = off + step
      if (end > size) end = size
      for (let i = off; i < end; i++) dv.setUint8(i, val)
      off = end
      if (off === size) {
        off = 0
        process.nextTick(() => process.runMicroTasks())
        return resolve()
      }
      process.nextTick(next)
    }
    next()
  })
}

function format (val) {
  return val.toString().padStart(12, ' ')
}

async function run () {
  let doGC = false
  const todo = parseInt(args[3] || '2')
  let done = 0
  const buffers = []
  const timer = setInterval(() => {
    if (doGC) gc()
    const { rss, external_memory, used_heap_size, total_heap_size } = process.memoryUsage()
    print(`RSS: ${format(rss)} EXT: ${format(external_memory)} Heap: ${format(used_heap_size)}/${total_heap_size} TODO: ${todo - done}, RUNS: ${runs}`)
  }, 1000)
  for (let i = 0; i < todo; i++) {
    const buf = Buffer.alloc(1024 * 1024 * 1024)
    await fillBuffer(buf, 255)
    buffers.push(buf)
    done++
  }
  if (--runs === 0) {
    doGC = true
    global.timer = timer
    return
  }
  clearTimeout(timer)
  run()
}

run()
