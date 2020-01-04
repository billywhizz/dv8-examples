function threadMain () {
  const longestInSeconds = parseInt(process.args[3] || '10', 10)
  global.t1 = setTimeout(() => {}, (Math.floor(Math.random() * longestInSeconds) + 3) * 1000)
}
function dump () {
  const threads = Object.keys(process.threads).length
  const mem = process.memoryUsage()
  const all = process.activeHandles()
  const handles = all.length
  const active = all.filter(h => h.active).length
  const summary = {}
  all.filter(h => h.active).forEach(h => {
    if (summary[h.type]) return summary[h.type]++
    summary[h.type] = 1
  })
  const stats = process.stats()
  const cpu = process.cpuUsage()
  //const heap = process.heapUsage()
  gc()
  print(JSON.stringify({ cpu, stats, mem, threads, handles, active, summary }, null, '  '))
}
const t1 = setInterval(dump, 1000)
const workers = parseInt(process.args[2] || '8', 10)
let done = workers
process.onExit = dump
while (done) {
  process.spawn(threadMain, result => {
    const { err } = result
    if (err) {
      print(err.message)
    }
    done++
    if (done === workers) {
      clearTimeout(t1)
    }
  }, { ipc: false })
  done--
}
