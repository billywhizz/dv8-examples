const { lookup } = require('./dns.js')

async function run () {
  const args = {
    query: process.args[2] || 'www.google.com',
    address: process.args[3] || '8.8.8.8',
    port: parseInt(process.args[4] || '53', 10)
  }
  const result = await lookup(args)
  const { address, port, message } = result
  print(`Server:      ${address}
Address:     ${address}#${port}

Non-authoritative answer:`)
  for (const answer of message.answer) {
    if (answer.qtype === 1) {
      const { name, ip } = answer
      print(`Name:        ${name.join('.')}
Address:     ${ip['0']}.${ip['1']}.${ip['2']}.${ip['3']}`)
    } else if (answer.qtype === 5) {
      const { name, cname } = answer
      print(`${name.join('.')} canonical name = ${cname.join('.')}`)
    }
  }
}

run()
