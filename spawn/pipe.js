const { exec } = require('./exec.js')
const buf = Buffer.alloc(4096)
const { UV_TTY_MODE_NORMAL, TTY } = library('tty', {})
const stdout = new TTY(1)
stdout.setup(buf, UV_TTY_MODE_NORMAL)
//source.buffer.copy(dest.buffer, len)
const source = exec({ file: args[2] || 'ls', args: args.slice(3) }, buf)
const dest = exec({ file: 'xxd', args: [] }, buf)
let todo = {}
setInterval(() => {
  Object.keys(todo).forEach(k => {
    print(`${k}.resume`)
    todo[k].resume()
  })
  todo = {}
}, 100)
source.stdout.onRead(len => {
  const r = dest.stdin.write(len)
  if (r < 0) return source.stdout.close()
  if (r < len) {
    print('source.stdout.pause')
    source.stdout.pause()
  }
})
dest.stdin.onDrain(() => {
  print('dest.stdin.drain')
  todo['source.stdout'] = source.stdout
})
source.stdout.onEnd(() => dest.stdin.close())
dest.stdout.onRead(len => {
  const r = stdout.write(len)
  if (r < 0) return dest.stdout.close()
  if (r < len) {
    print('source.stdout.pause')
    dest.stdout.pause()
  }
})
stdout.onDrain(() => {
  print('stdout.drain')
  todo['dest.stdout'] = dest.stdout
})
dest.stdout.resume()
source.stdout.resume()
source.onExit = () => stdout.close()
