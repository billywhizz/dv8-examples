const { spawn } = require('./spawn.js')

const cfg = {
  file: 'ls',
  args: ['-lah'],
  cwd: process.cwd(),
  onExit: () => print('done'),
  onStdOut: (buf, len) => print(buf.read(0, len))
}

spawn(cfg)
