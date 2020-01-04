const { EventLoop } = library('loop', {})
const { Timer } = library('timer', {})

const t = new Timer()
const loop = new EventLoop()

global.onUncaughtException = err => {
  print(err.stack)
}
print('hello')
// one liners

const activeHandles = () => {
  const buf = new Buffer()
  buf.bytes = buf.alloc(16384)
  buf.size = buf.bytes.byteLength

  loop.listHandles(buf)
  const bytes = new Uint8Array(buf.bytes)
  let off = 0
  const handles = []
  while (1) {
    const active = bytes[off]
    if (active === 255) break
    const len = bytes[off + 1]
    if (len > 0) {
      const type = buf.read(off + 2, len)
      handles.push({ active, type })
    } else {
      handles.push({ active, type: 'unknown' })
    }
    off += (2 + len)
  }
  return handles
}

// print process pid
print((new (library('process', {}).Process)()).pid())

// print rss usage
const mem = new Float64Array(16);(new (library('process', {}).Process)()).memoryUsage(mem);print(mem[0])

t.start(() => {
  print(JSON.stringify(activeHandles(), null, '  '))
  t.close()
  throw new Error('Foo')
}, 1000)

print(JSON.stringify(activeHandles(), null, '  '))
loop.run()
