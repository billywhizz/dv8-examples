const { readFileSync } = require('../common/fs.js')
const file = readFileSync(args[2])
const size = file.size
let runs = parseInt(args[3] || '1')
const start = Date.now()
while (runs--) {
  const b64 = file.decode(0, size)
  print(b64)
}
print(Date.now() - start)
print(process.memoryUsage().rss)
