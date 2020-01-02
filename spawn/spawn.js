
const { Process } = library('process', {})
const { Socket, PIPE } = library('socket', {})

function spawn (child) {
  const buf = Buffer.alloc(4096)
  const stdin = new Socket(PIPE)
  const stdout = new Socket(PIPE)
  stdout.onRead(len => child.onStdOut(buf, len))
  const stderr = new Socket(PIPE)
  stdin.create()
  stdin.setup(buf, buf)
  stdout.create()
  stdout.setup(buf, buf)
  stderr.create()
  stderr.setup(buf, buf)
  const { file, args, cwd } = child
  child.pid = (new Process()).spawn(file, cwd, args[0], stdin, stdout, stderr, (status, signal) => {
    child.status = Number(status.toString())
    child.signal = signal
    child.onExit()
  })
  stdin.resume()
  stdout.resume()
  stderr.resume()
  return child
}

module.exports = { spawn }
