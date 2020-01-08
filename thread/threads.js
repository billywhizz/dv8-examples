function threadMain () {
  const longestInSeconds = parseInt(process.args[3] || '10', 10)
  setTimeout(() => {}, (Math.floor(Math.random() * longestInSeconds) + 3) * 1000)
}
const timer = setInterval(() => print(JSON.stringify(process.stats())), 1000)
const workers = parseInt(process.args[2] || '8', 10)
let done = workers
process.onExit = () => print(JSON.stringify(process.stats()))
while (done) {
  process.spawn(threadMain, result => {
    const { err } = result
    if (err) throw err
    done++
    if (done === workers) {
      clearTimeout(timer)
    }
  }, { ipc: false })
  done--
}
