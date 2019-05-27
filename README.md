# Introduction

Examples for the dv8 runtime (github/billywhizz/dv8)

## Install Binary (should work on x86_64 with modern kernel)
```
curl -s https://raw.githubusercontent.com/billywhizz/dv8-releases/v0.0.7/linux-x86_64/install.sh | sh
```
or
```
wget https://github.com/billywhizz/dv8-releases/archive/v0.0.7.tar.gz
tar -zxvf v0.0.7.tar.gz
sudo cp dv8-releases-0.0.7/linux-x86_64/dv8 /usr/local/bin
rm -fr dv8-releases-0.0.7
```
# Examples

## HTTP Server (Single Thread)

```
cd httpd
dv8 httpd.js
```

## HTTP Server (Two THreads)

```
cd httpd
dv8 httpd.js 2
```

## Test HTTP Server
```
curl -vvv http://127.0.0.1:3000
```

## Benchmark HTTP Server (Non Pipelined)
```
wrk -c 64 -t 2 -d 20 http://127.0.0.1:3000/
```

## Benchmark HTTP Server (Pipelined)
```
wrk -c 256 -t 2 -d 20 -s pipeline.lua http://127.0.0.1:3000/ -- 1024
```

## TTY

### Count Stdin Bytes (inside shell)
```
cd tty
dd if=/dev/zero bs=65536 count=1000000 | dv8 count.js
```

### Pipe/Cat (inside shell)
```
cd tty
dd if=/dev/zero bs=65536 count=1000000 | dv8 pipe.js | dv8 count.js
```

## FS

### Write to a file
```
cd fs
dv8 writeFile.js
```

## UDP

### DNS Query
```
cd udp
dv8 dns.js
```

## Thread

### Timing Thread Spawn with IPC
```
cd thread
dv8 spawn.js
```

### Street Test Threading
```
cd thread
dv8 bench.js
```

## Process

### Private Memory Usage
```
dv8 rss.js
```