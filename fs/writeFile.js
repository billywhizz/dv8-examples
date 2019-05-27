const { File, FileSystem, O_RDONLY, O_WRONLY, O_RDWR, O_APPEND, O_CREAT, O_TRUNC, O_EXCL } = library('fs', {})
const buf = Buffer.alloc(4096)
const file = new File()
file.setup(buf, buf)
file.fd = file.open('./foo.txt', O_CREAT | O_WRONLY)
file.write(1, 0)
file.close()