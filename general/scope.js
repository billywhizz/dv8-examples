const b = Buffer.alloc(100)

process.onExit = () => {
  gc()
  const threads = Object.keys(process.threads).length
  const mem = process.memoryUsage()
  const all = process.activeHandles()
  const handles = all.length
  const active = {}
  all.filter(h => h.active).forEach(h => {
    if (active[h.type]) return active[h.type]++
    active[h.type] = 1
  })
  const stats = process.stats()
  const cpu = process.cpuUsage()
  const heap = process.heapUsage()
  print(JSON.stringify({ heap, cpu, stats, mem, threads, handles, active }, null, '  '))
}

const { Socket } = library('socket', {})
const { OS } = library('os', {})
const { File, FileSystem } = library('fs', {})
const { EventLoop } = library('loop', {})
const { Process } = library('process', {})
const { ZLib } = library('zlib', {})
const { Thread } = library('thread', {})
const { Timer } = library('timer', {})
const { TTY } = library('tty', {})
const { UDP } = library('udp', {})

function foo() {
  const sock = new Socket()
  const os = new OS()
  const f = new File()
  const fs = new FileSystem()
  const loop = new EventLoop()
  const p = new Process()
  const zlib = new ZLib()
  const t = new Thread()
  const timer = new Timer()
  const tty = new TTY()
  const udp = new UDP()
}

foo()

const t = setTimeout(() => {
  gc()
}, 1000)
