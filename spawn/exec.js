
const { Socket, PIPE } = library('socket', {})

function exec (child, buf = Buffer.alloc(4096)) {
  const stdin = new Socket(PIPE)
  const stdout = new Socket(PIPE)
  const stderr = new Socket(PIPE)
  stdin.create()
  stdin.setup(buf, buf)
  stdout.create()
  stdout.setup(buf, buf)
  stderr.create()
  stderr.setup(buf, buf)
  const { file, args, cwd = process.cwd() } = child
  child.pid = process.exec(file, cwd, args.map(v => v.toString()), stdin, stdout, stderr, (status, signal) => {
    child.status = Number(status.toString())
    child.signal = signal
    if (child.onExit) child.onExit(status, signal)
  })
  child.stdin = stdin
  child.stdout = stdout
  child.stderr = stderr
  child.buffer = buf
  return child
}

module.exports = { exec }
