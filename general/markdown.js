const { parse } = require('./marked.min.js')
const { readFileSync, writeFileSync } = require('../common/fs.js')
const markdown = readFileSync('test.md')
const html = parse(markdown.read(0, markdown.size))
writeFileSync('./markdown.html', Buffer.fromString(html))
print(process.memoryUsage().rss)
gc()
process.onExit = () => {
  print('goodbye')
  print(JSON.stringify(process.activeHandles()))
}
