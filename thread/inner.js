function threadMain () {
  function threadInner () {
    print('threadInner')
  }
  print('threadMain')
  const { Thread } = library('thread', {})
  const thread = new Thread()
  const envJSON = JSON.stringify(process.env)
  const argsJSON = JSON.stringify(process.args)
  const bufferSize = envJSON.length + argsJSON.length + 17
  thread.buffer = Buffer.alloc(bufferSize)
  const view = new DataView(thread.buffer.bytes)
  thread.view = view
  view.setUint8(0, thread.id)
  view.setUint32(5, envJSON.length)
  thread.buffer.write(envJSON, 9)
  view.setUint32(envJSON.length + 9, argsJSON.length)
  thread.buffer.write(argsJSON, envJSON.length + 13)
  view.setUint32(envJSON.length + argsJSON.length + 13, 0)
  thread.id = thread.start(threadInner, err => {
    if (err) {
      print(err.message)
    }
    print(`thread ${thread.id} done`)
  }, thread.buffer)
}

process.spawn(threadMain, result => {
  const { err, thread } = result
  if (err) {
    print(err.message)
    return
  }
  print(`thread ${thread.id} done`)
}, {})
