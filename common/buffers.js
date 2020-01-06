const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('')

function decodeBase64 (input) {
  const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let output = ''
  let i = 0
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
  do {
    const enc1 = keyStr.indexOf(input.charAt(i++))
    const enc2 = keyStr.indexOf(input.charAt(i++))
    const enc3 = keyStr.indexOf(input.charAt(i++))
    const enc4 = keyStr.indexOf(input.charAt(i++))
    const chr1 = enc1 << 2 | enc2 >> 4
    const chr2 = (enc2 & 15) << 4 | enc3 >> 2
    const chr3 = (enc3 & 3) << 6 | enc4
    output = output + String.fromCharCode(chr1)
    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2)
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3)
    }
  } while (i < input.length)
  return output
}

const buf2b64 = (buf, len = buf.size) => {
  const bytes = new Uint8Array(buf.bytes.slice(0, len))
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

const b642buf = (b64) => {
  const decoded = decodeBase64(b64)
  var bytes = new Uint8Array(decoded.length)
  for (var i = 0; i < decoded.length; ++i) {
    bytes[i] = decoded.charCodeAt(i)
  }
  return Buffer.fromArrayBuffer(bytes.buffer)
}

const buf2hex = (buf, len) => {
  return Array.prototype.map.call((new Uint8Array(buf.bytes)).slice(0, len), x => ('00' + x.toString(16)).slice(-2)).join('')
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
