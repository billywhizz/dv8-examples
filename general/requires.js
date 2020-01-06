const t1 = setInterval(() => {
  const requires = [
    require('mod.js'),
    require('/home/andrew/Documents/source/js/dv8-examples/general/mod.js'),
    require('/home/andrew/Documents/source/js/dv8-examples/common/buffers.js'),
    require('../common/buffers.js'),
    require('../common/meter.js'),
    require('../common/path.js'),
    require('../common/percentile.js'),
  ]
}, 10)

const t2 = setInterval(() => {
  gc()
  const threads = Object.keys(process.threads).length
  const mem = process.memoryUsage()
  const all = process.activeHandles()
  const handles = all.length
  const active = {}
  all.filter(h => h.active).forEach(h => {
    if (active[h.type]) return active[h.type]++
    active[h.type] = 1
  })
  const stats = process.stats()
  const cpu = process.cpuUsage()
  const heap = process.heapUsage()
  //print(JSON.stringify({ heap, cpu, stats, mem, threads, handles, active }, null, '  '))
}, 1000)
