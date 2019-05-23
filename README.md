# Introduction

Examples for the dv8 runtime (github/billywhizz/dv8)

# Get a Shell and Mount a local directory
```
docker run -it --rm -v $(pwd):/app billywhizz/dv8:0.0.6 /bin/sh
```

# Examples

## HTTP Server

```
docker run -it --rm -v $(pwd)/httpd:/app -p 3000:3000 billywhizz/dv8:0.0.6 dv8 httpd.js
```

## TTY

### Count Stdin Bytes (inside shell)
```
docker run -it --rm -v $(pwd):/app billywhizz/dv8:0.0.6 /bin/sh
cd tty
dd if=/dev/zero bs=65536 count=1000000 | dv8 count.js
```

### Pipe/Cat (inside shell)
```
docker run -it --rm -v $(pwd):/app billywhizz/dv8:0.0.6 /bin/sh
cd tty
dd if=/dev/zero bs=65536 count=1000000 | dv8 pipe.js | dv8 count.js
```

## UDP

### DNS Query
```
docker run -it --rm -v $(pwd):/app billywhizz/dv8:0.0.6 /bin/sh
cd udp
dv8 dns.js
```
