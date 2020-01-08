function threadMain () {
  process.send({ time: process.hrtime().toString() })
}

const thousand = BigInt(1000)

function spawn () {
  const start = process.hrtime()
  const thread = process.spawn(threadMain, result => {
    print(`thread ${result.thread.id} done`)
  }, { ipc: true })
  thread.onMessage(message => {
    const boot = BigInt(message.time)
    print(`${thread.id.toString().padEnd(5, ' ')} : ${(boot - start) / thousand} usec`)
    thread.sock.close()
  })
}

const WORKERS = parseInt(args[2] || '4', 10)
let i = WORKERS
while (i--) {
  spawn()
}
