const TODO = parseInt(process.args[2] || '4', 10)
let done = 0

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function threadCompleted (context) {
  const { err, thread } = context
  if (err) {
    print(err.message)
  }
  print(`thread: ${thread.id} done`)
  done++
}

function threadFunc () {
  setTimeout(() => {}, 1000)
}

async function join () {
  while (done < TODO) {
    await sleep(10)
    done++
  }
}

async function run () {
  let i = TODO
  const start = Date.now()
  while (i--) {
    process.spawn(threadFunc, threadCompleted)
  }
  await join()
  print(Date.now() - start)
}

run().catch(err => print(err.message))
