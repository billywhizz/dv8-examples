function threadMain () {
  process.sock.onWrite(() => {
    process.sock.close()
  })
  process.send({ mem: process.memoryUsage().rss, time: process.hrtime().toString() })
  process.onExit = () => {
    print(`Process ${process.PID}, thread ${process.TID} shutting down \n${JSON.stringify(process.activeHandles())}`)
  }
}

const thousand = BigInt(1000)

function spawn () {
  const start = process.hrtime()
  const thread = process.spawn(threadMain, result => {
    thread.sock.close()
    print(JSON.stringify(thread))
    setTimeout(spawn, 1000)
  }, { ipc: true })
  thread.onMessage(output => {
    const boot = BigInt(output.time)
    const { mem } = output
    const time = (boot - start) / thousand
    thread.mem = mem
    thread.time = time.toString()
  })
}

spawn()
