const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('')

const buf2b64 = (buf, len) => {
  const bytes = new Uint8Array(buf.bytes)
  let i = 0
  const encoded = []
  while (i < len) {
    const a = i < len ? bytes[i++] : 0
    const b = i < len ? bytes[i++] : 0
    const c = i < len ? bytes[i++] : 0
    const triple = (a << 0x10) + (b << 0x08) + c
    encoded.push(lookup[(triple >> 3 * 6) & 0x3f])
    encoded.push(lookup[(triple >> 2 * 6) & 0x3f])
    encoded.push(lookup[(triple >> 1 * 6) & 0x3f])
    encoded.push(lookup[(triple >> 0 * 6) & 0x3f])
  }
  const over = len % 3
  if (over === 1) {
    encoded[encoded.length - 1] = '='
    encoded[encoded.length - 2] = '='
  } else if (over === 2) {
    encoded[encoded.length - 1] = '='
  }
  return encoded.join('')
}

const buf2hex = (buf, len) => {
  return Array.prototype.map.call((new Uint8Array(buf.bytes)).slice(0, len), x => ('00' + x.toString(16)).slice(-2)).join('')
}

const b642buf = (b64, buf) => {

}

const hex2buf = (hex, buf) => {
  const bytes = new Uint8Array(buf.bytes)
  let len = 0
  hex.match(/.{1,2}/g).forEach(byte => {
    bytes[len++] = parseInt(byte, 16)
  })
  return len
}

const buf2binary = (bytes, len) => {
  let i = 0
  const results = []
  let result = []
  let address = 0
  while (i < len) {
    if (i % 8 === 0) {
      result = [`${address.toString(8).padStart(10, '0')}:`]
      results.push(result)
      address += 8
    }
    result.push(bytes[i].toString(2).padStart(8, '0'))
    i++
  }
  return results.map(v => v.join(' ')).join('\n')
}

function pprint (bytes, width = 16, pos = 0) {
  const result = []
  const len = bytes.length
  for (let i = 0; i < len; i++) {
    if (i % width === 0) {
      if (i === 0) {
        result.push('')
      } else {
        result.push('\n')
      }
    }
    if (i % 8 === 0) {
      result.push(`${i.toString().padStart(3, ' ')}:`)
    }
    if (bytes[i] >= 32 && bytes[i] <= 126) {
      result.push(`|${bytes[i].toString().padStart(3, ' ')} ${String.fromCharCode(bytes[i])}`)
    } else {
      result.push(`|${bytes[i].toString().padStart(3, ' ')}  `)
    }
  }
  print(result.join(' '))
}

module.exports = {
  buf2b64, buf2hex, hex2buf, b642buf, buf2binary, pprint
}
