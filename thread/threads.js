function threadMain () {
  global.t1 = setTimeout(() => {}, (Math.floor(Math.random() * 10) + 3) * 1000)
}
global.t1 = setInterval(() => {
  const { threads } = process
  const { rss } = process.memoryUsage()
  print(JSON.stringify({ rss, threads: Object.keys(threads).length }))
}, 1000)
const workers = parseInt(process.args[2] || '8', 10)
let done = workers
while (done) {
  process.spawn(threadMain, result => {
    const { err } = result
    if (err) {
      print(err.message)
    }
    done++
    if (done === workers) {
      clearTimeout(global.t1)
    }
  }, { ipc: false })
  done--
}
