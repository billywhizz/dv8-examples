const { File, O_RDONLY, O_CLOEXEC, O_CREAT, O_WRONLY } = library('fs', {})

const MAXSIZE = 1 * 1024 * 1024

function readFileSync (fname) {
  const buf = Buffer.alloc(MAXSIZE)
  const file = new File()
  file.setup(buf, buf)
  file.open(fname, O_RDONLY | O_CLOEXEC)
  buf.size = file.read(MAXSIZE, 0)
  file.close()
  return buf
}

function writeFileSync (fileName, buf) {
  const file = new File()
  file.setup(buf, buf)
  file.fd = file.open(fileName, O_CREAT | O_WRONLY)
  file.write(buf.size, 0)
  file.close()
}

module.exports = { readFileSync, writeFileSync }
