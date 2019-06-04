## httpd.js

example of a http server optimised for benchmarking


## HTTP Server (Single Thread)

```
cd http
dv8 httpd.js
```

## HTTP Server (Two Threads)

```
cd httpd
dv8 httpd.js 2
```

## HTTP Server (32 Threads)

```
cd httpd
UV_THREADPOOL_SIZE=36 dv8 httpd.js 32
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
wrk -c 256 -t 2 -d 20 -s ./bench/pipeline.lua http://127.0.0.1:3000/ -- 1024
```
