const TODO = 10000
let done = 0

const sleep = ms => new Promise(ok => setTimeout(ok, ms))

function threadCompleted(context) {
    const { err, thread, status } = context
    //print(`thread: ${thread.id} completed: ${status}`)
    done++
}

function threadFunc() {
    //setTimeout(() => {}, 1000)
}

async function join() {
    while (done < TODO) {
        await sleep(10)
    }
}

async function run() {
    let i = TODO
    const start = Date.now()
    while (i--) {
        process.spawn(threadFunc, threadCompleted)
    }
    await join()
    print(Date.now() - start)
}

run().catch(err => print(err.message))
