const { File, O_RDONLY } = library('fs', {})

function readFileSync (fname) {
  const MAXSIZE = 1024 * 1024
  const buf = Buffer.alloc(MAXSIZE)
  const file = new File()
  file.setup(buf, buf)
  file.open(fname, O_RDONLY)
  buf.size = file.read(MAXSIZE, 0)
  // const ab = buf.bytes.slice(0, file.read(MAXSIZE, 0))
  file.close()
  return buf
}

function writeFileSync (fileName, buf) {
  const { File, O_WRONLY, O_CREAT } = library('fs', {})
  const file = new File()
  file.setup(buf, buf)
  file.fd = file.open(fileName, O_CREAT | O_WRONLY)
  file.write(buf.size, 0)
  file.close()
}

module.exports = { readFileSync, writeFileSync }
