const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run () {
  await sleep(1000)
  throw new Error('Foo')
}

global.timer = setTimeout(() => {
  throw new Error('Foo')
}, 1000)

global.timer2 = setTimeout(() => {
  try {
    throw new Error('Foo')
  } catch (err) {
    formatError(err)
  }
}, 2000)

function getStackTrace (err) {
  const out = []
  out.push(`Error: ${err.message}`)
  out.push(`in ${err.fileName} at line ${err.lineNumber}`)
  for (const frame of err.frames) {
    if (frame.functionName) {
      out.push(`    at ${frame.functionName} (${frame.scriptName}:${frame.line}:${frame.column})`)
    } else {
      out.push(`    at ${frame.scriptName}:${frame.line}:${frame.column}`)
    }
  }
  return out.join('\n')
}

function formatError (err) {
  print(err.stack)
  print(JSON.stringify(err, null, '  '))
  print(getStackTrace(err))
}

process.onUncaughtException = formatError

run().catch(err => formatError(err))
run()

throw new Error('Foo')
