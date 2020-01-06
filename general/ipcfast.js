function threadMain () {
  const { start, stop } = require('../common/meter.js')
  const { sock } = process
  const { wb } = sock.buffers
  process.onMessage(({ name }) => {
    sock.name = name
    sock.onRead(len => sock.write(len))
    sock.onEnd(() => stop(sock))
    sock.write(wb.size)
    start(sock)
  })
}

function spawn (name) {
  const thread = process.spawn(threadMain, () => {}, { ipc: true, bufSize })
  thread.send({ name })
  pipe(thread)
  return thread
}

function pipe (source, dest = source) {
  source.sock.onRead(len => (running ? dest.sock.write(len) : source.sock.close()))
}

function round (num, places = 2) {
  const factor = Math.pow(10, places)
  return (Math.floor(num * factor) / factor)
}

function onExit () {
  const elapsed = (Date.now() - start) * 1000
  const stats = process.stats()
  const { cpu } = stats
  const { user, system } = cpu
  const usage = (user + system) / elapsed
  const split = [user / (user + system), system / (user + system)]
  print(`${round(elapsed / 1000)} ms ${round(usage.toFixed(2))} cores (${round(split[0]).toFixed(2)}/${round(split[1]).toFixed(2)}) user/sys`)
}

function showStats () {
  print(JSON.stringify(process.stats().summary, null, '  '))
}

function onFinish () {
  running = false
  clearTimeout(timer)
}

const bufSize = parseInt(args[2] || '4096')
const seconds = parseInt(args[3] || '5')
let threads = parseInt(args[4] || '2')
let running = true
const timer = setInterval(showStats, 1000)
const start = Date.now()
process.onExit = onExit
setTimeout(onFinish, seconds * 1000)
while (threads--) spawn(`Thread: ${threads}`)
