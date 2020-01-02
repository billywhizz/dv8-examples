const stats = new BigUint64Array(20)
const eight = BigInt(8)
const { UV_TTY_MODE_NORMAL, TTY } = library('tty', {})
const stdin = new TTY(0)
const BUFFER_SIZE = 64 * 1024
const buf = Buffer.alloc(BUFFER_SIZE)
stdin.name = 'count.stdin'
stdin.setup(buf, UV_TTY_MODE_NORMAL)
stdin.onEnd(() => stdin.close())
stdin.onClose(() => {
  clearTimeout(stdin.timer)
})
stdin.resume()
let lastBytes = BigInt(0)
let lastRate = BigInt(0)
stdin.timer = setInterval(() => {
  stdin.stats(stats)
  const mem = process.memoryUsage()
  const [, , read] = stats
  const bytesRead = read - lastBytes
  lastBytes = read
  const { start } = stdin
  const finish = Date.now()
  const elapsed = Math.max(finish - start, 1)
  const rate = (bytesRead * eight / BigInt(elapsed)) / 1000n
  stdin.start = finish
  if (lastRate > 0) {
    const jitter = Math.floor(Math.abs(parseFloat((rate - lastRate).toString()) / parseFloat(lastRate.toString())) * 1000) / 1000
    print(`rate: ${rate} Mbit, jitter: ${jitter.toFixed(3).padStart(6, ' ')}, last: ${lastRate}, rss: ${mem.rss}`)
  }
  lastRate = rate
}, 1000)
stdin.start = Date.now()
