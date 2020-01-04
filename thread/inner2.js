function handler (result) {
  print(`thread ${result.thread.id} done`)
}

function threadMain () {
  function handler (result) {
    print(`thread ${result.thread.id} done`)
  }
  function threadInner () {
    function handler (result) {
      print(`thread ${result.thread.id} done`)
    }
    function threadInner2 () {
      print(`threadInner2 PID: ${process.PID} TID: ${process.TID}`)
      setTimeout(() => {
        print('done')
      }, 3000)
    }
    print(`threadInner PID: ${process.PID} TID: ${process.TID}`)
    setTimeout(() => process.spawn(threadInner2, handler, {}), 3000)
  }
  print(`threadMain PID: ${process.PID} TID: ${process.TID}`)
  setTimeout(() => process.spawn(threadInner, handler, {}), 3000)
}

process.spawn(threadMain, handler, {})
