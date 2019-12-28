const { UV_TTY_MODE_RAW, TTY } = library('tty', {})
const { Socket, TCP } = library('socket', {})
const { start, stop } = require('../common/meter.js')

const BUFFER_SIZE = 64 * 1024
const stdin = new TTY(0)
const stdout = new Socket(TCP)
const buf = Buffer.alloc(BUFFER_SIZE)
stdin.setup(buf, UV_TTY_MODE_RAW)
stdout.setup(buf, buf)
stdin.name = 'pipe.stdin'
stdout.name = 'pipe.stdout'
stdin.onRead(len => {
  const r = stdout.write(len)
  if (r < 0) return stdout.close()
  if (r < len) return stdin.pause()
})
stdin.onEnd(() => {
  stop(stdin)
  stdin.close()
})
stdin.onClose(() => stdout.close())
stdin.onError(err => print(`stdin.error: ${err}`))
stdout.onDrain(() => stdin.resume())
stdout.onClose(() => stop(stdout))
stdout.onError((err, message) => print(`stdout.error: ${err}\n${message}`))
stdin.pause()
stdout.onConnect(() => {
  stdin.resume()
  start(stdin, true)
  stdout.setNoDelay(true)
  start(stdout, true)
})
stdout.connect('0.0.0.0', 3000)