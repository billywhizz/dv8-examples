const { UV_TTY_MODE_NORMAL, TTY } = library('tty', {})

function replacer (k, v) {
  if (typeof v === 'bigint') {
    return v.toString()
  }
  return v
}

function repl () {
  const BUFFER_SIZE = 64 * 1024
  const MAX_BUFFER = 4 * BUFFER_SIZE
  const stdin = new TTY(0)
  const buf = Buffer.alloc(BUFFER_SIZE)
  stdin.setup(buf, UV_TTY_MODE_NORMAL)
  stdin.onRead(len => {
    const source = buf.read(0, len)
    try {
      const result = runScript(source, 'repl')
      let payload = `${JSON.stringify(result, replacer, 2)}\n`
      const r = stdout.write(buf.write(payload, 0))
      if (r < 0) return stdout.close()
    } catch (err) {
      print(err.stack)
    }
    const r = stdout.write(buf.write('> ', 0))
    if (r < 0) return stdout.close()
    if (r < len && stdout.queueSize() >= MAX_BUFFER) stdin.pause()
  })
  stdin.onEnd(() => stdin.close())
  stdin.onClose(() => stdout.close())
  const stdout = new TTY(1)
  stdout.setup(buf, UV_TTY_MODE_NORMAL)
  stdout.onDrain(() => stdin.resume())
  stdout.onClose(() => stdin.close())
  if (stdout.write(buf.write('> ', 0)) < 0) {
    stdout.close()
  } else {
    stdin.resume()
  }
}

repl()
