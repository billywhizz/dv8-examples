function threadOne () {
  process.onMessage(m => print(JSON.stringify(m)))
  process.send({ omg1: 'this is cool' })
  print('hello from threadTwo')
}

function threadTwo () {
  process.onMessage(m => print(JSON.stringify(m)))
  process.send({ omg2: 'this is cool' })
  print('hello from threadOne')
}

function onComplete (result) {
  const { thread } = result
  print(`thread ${thread.id} complete`)
}

const t1 = process.spawn(threadOne, onComplete, { ipc: true })
const t2 = process.spawn(threadTwo, onComplete, { ipc: true })

t1.onMessage(m => print(JSON.stringify(m)))
t2.onMessage(m => print(JSON.stringify(m)))

t1.send({ ftw: 'wot?' })
t1.send({ wot: 'ftw?' })
