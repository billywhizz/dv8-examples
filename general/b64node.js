const { readFileSync } = require('fs')
const file = readFileSync(process.argv[2])
let runs = parseInt(process.argv[3] || '1')
const s = 'base64'
const start = Date.now()
while (runs--) {
  const b64 = file.toString(s)
  print(b64)
}
console.log(Date.now() - start)
console.log(process.memoryUsage().rss)
