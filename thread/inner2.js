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
      print('threadInner2')
      setTimeout(() => {
        print('done')
      }, 3000)
    }
    print('threadInner')
    setTimeout(() => process.spawn(threadInner2, handler, {}), 3000)
  }
  print('threadMain')
  setTimeout(() => process.spawn(threadInner, handler, {}), 3000)
}

process.spawn(threadMain, handler, {})
