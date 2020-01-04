function threadMain () {
  const { OS } = library('os', {})
  const { exec } = require('../spawn/exec.js')

  const signals = {
    SIGTERM: 15,
    SIGUSR1: 10,
    SIGHUP: 1,
    SIGINT: 2,
    SIGUSR2: 12,
    SIGKILL: 9
  }

  function signalName (signal) {
    let signalName = 'UNKNOWN'
    Object.keys(signals).some(k => {
      if (signals[k] === signal) {
        signalName = k
        return true
      }
    })
    return signalName
  }

  function signalHandler (signal, exit = false) {
    const os = new OS()
    os.onSignal(() => {
      print(`Thread ${process.TID} signal ${signalName(signal)}`)
      if (exit) shutdown()
    }, signal)
    return os
  }

  if (process.TID === 1) {
    signalHandler(signals.SIGINT, true)
  } else {
    signalHandler(signals.SIGTERM, true)
  }
  if (process.TID === 1) {
    signalHandler(signals.SIGUSR1)
  } else {
    signalHandler(signals.SIGHUP)
  }
  signalHandler(signals.SIGUSR2)

  print(`Process ${process.PID}, thread ${process.TID} started`)

  if (process.TID === 1) {
    setTimeout(() => exec({ file: 'kill', args: ['-s', signals.SIGUSR1, process.PID] }), 1000)
    setTimeout(() => exec({ file: 'kill', args: ['-s', signals.SIGUSR2, process.PID] }), 3000)
    setTimeout(() => exec({ file: 'kill', args: ['-s', signals.SIGHUP, process.PID] }), 5000)
    setTimeout(() => exec({ file: 'kill', args: ['-s', signals.SIGTERM, process.PID] }), 6000)
    setTimeout(() => exec({ file: 'kill', args: ['-s', signals.SIGINT, process.PID] }), 7000)
    setTimeout(() => exec({ file: 'kill', args: ['-s', signals.SIGKILL, process.PID] }), 8000)
  }
  print(`Process ${process.PID}, thread ${process.TID}\n${JSON.stringify(process.activeHandles(), null, '  ')}`)

  process.onExit = () => {
    print(`Process ${process.PID}, thread ${process.TID} shutting down \n${JSON.stringify(process.activeHandles(), null, '  ')}`)
  }
}

process.onExit = () => {
  print(`Process ${process.PID} shutting down\n${JSON.stringify(process.activeHandles(), null, '  ')}`)
}

process.spawn(threadMain, result => print(`thread ${result.thread.id} done`), {})
process.spawn(threadMain, result => print(`thread ${result.thread.id} done`), {})

process.nextTick(() => {
  print(`Process ${process.PID} startup\n${JSON.stringify(process.activeHandles(), null, '  ')}`)
})
