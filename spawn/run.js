const { exec } = require('./exec.js')

const cfg = {
  file: process.args[2] || 'ls',
  args: process.args.length > 2 ? process.args.slice(3) : ['-lah'],
  cwd: process.cwd(),
  onExit: (status, signal) => {
    print(`exited: ${status}, signal: ${signal}`)
  }
}

const { stdout, stderr, buffer } = exec(cfg)
stdout.resume()
stdout.onRead(len => {
  print(buffer.read(0, len))
})
stderr.resume()
stderr.onRead(len => {
  print(buffer.read(0, len))
})
