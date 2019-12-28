# Introduction

Examples for the dv8 runtime (github/billywhizz/dv8)

## Install Binary (should work on x86_64 with modern kernel)
```
curl -s https://raw.githubusercontent.com/billywhizz/dv8-releases/v0.0.9/linux-x86_64/install.sh | sh
sudo cp dv8 /usr/local/bin/
```
or
```
wget https://github.com/billywhizz/dv8-releases/archive/v0.0.9.tar.gz
tar -zxvf v0.0.9.tar.gz
sudo cp dv8-releases-0.0.9/linux-x86_64/dv8 /usr/local/bin
rm -fr dv8-releases-0.0.9
```

## If you dont run linux, run inside a docker container
```
docker run -it --rm --name dv8 -v $(pwd)/dv8:/usr/local/bin/dv8 -v $(pwd):/source --workdir /source alpine:3.9 /bin/sh
```

## Start with a repl so you can inspect the runtime and run commands
```
dv8
```

## Evaluate some javascript from command line
```
dv8 -e 'const mem = new Float64Array(16);memoryUsage(mem);print(mem[0])'
```

## Evaluate with v8 command line switches
```
dv8 --write-protect-code-memory --optimize-for-size --jitless --no-expose-wasm -e 'const mem = new Float64Array(16);memoryUsage(mem);print(mem[0])'
```

# Examples

## bench

Various Benchmarks and Reports

## common

Common functions used across examples

## crypto

Crypto/TLS examples

## debugger

Kinda working PoC of debugging with v8 inspector protocol

## fs

File System examples

## http

HTTP client and server examples

## sockets

Unix domain socket and TCP examples

## thread

Threading examples

## tty

TTY examples

## udp

UDP examples

## zlib

ZLib examples