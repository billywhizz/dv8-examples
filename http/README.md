## httpd.js

example of a http server optimised for benchmarking


## HTTP Server (Single Thread)

```
dv8 httpd.js
```

## HTTP Server (Two Threads)

```
dv8 httpd.js 2
```

## HTTP Server (32 Threads)

```
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
wrk -c 256 -t 2 -d 20 -s ../bench/pipeline.lua http://127.0.0.1:3000/ -- 1024
```

## min.js

minimal single threaded http server

## tls.js

https server

```
curl -vvv -k https://127.0.0.1:3000/
```

## pico.js

http server using picoHttpParser instead of http-parser. needs work

## native.js

a http server for dv8 static using only inbuilt sockets and all http processing in JS

## fast.js

a very fast baseline http server completely in JS on dv8 static

```bash
dv8 fast.js # 15 MB RSS

wrk -c 64 -t 2 -d 5 --latency http://127.0.0.1:3001/
Running 5s test @ http://127.0.0.1:3001/
  2 threads and 64 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   372.96us   80.89us   1.89ms   90.42%
    Req/Sec    84.10k     6.02k   95.40k    74.51%
  Latency Distribution
     50%  356.00us
     75%  368.00us
     90%  401.00us
     99%  706.00us
  853337 requests in 5.10s, 104.17MB read
Requests/sec: 167391.38
Transfer/sec:     20.43MB

wrk -c 256 -t 2 -d 20 -s ../bench/pipeline.lua --latency http://127.0.0.1:3001/ -- 256
Running 20s test @ http://127.0.0.1:3001/
  2 threads and 256 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.40ms    3.89ms  43.22ms   63.39%
    Req/Sec     2.59M   215.39k    2.86M    67.75%
  Latency Distribution
     50%    8.08ms
     75%   11.36ms
     90%    0.00us
     99%    0.00us
  103203584 requests in 20.06s, 12.30GB read
Requests/sec: 5145973.48
Transfer/sec:    628.17MB
```