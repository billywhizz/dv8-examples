## UNIXserver.js

a unix socket server. echoes bytes back to client. dumps metrics for each connection when it closes.

```bash
rm -f UNIX.sock
dv8 UNIXserver.js
```

## UNIXclient.js

a unix socket client. pushes data to socket server as fast as it can. runs for 5 seconds by default. dumps metrics for each connection when it closes

```bash
# run for 10 seconds
dv8 UNIXclient.js 10
```

## TCPserver.js

a tcp server. echoes bytes back to client. dumps metrics for each connection when it closes.

```bash
dv8 TCPserver.js
```

## TCPclient.js

a tcp client. pushes data to socket server as fast as it can. runs for 5 seconds by default. dumps metrics for each connection when it closes

```bash
# run for 10 seconds
dv8 TCPclient.js 10
```

## netcat.js

a netcat tool. dumps stdin to tcp server listening on localhost:3001

```bash
# start the server
dv8 TCPserver.js

# dump zeros into netcat which will forward to TCPserver.js
dd if=/dev/zero bs=65536 count=100000 | dv8 netcat.js

```

## pipes.js

starts a client and a server thread which write to each other as fast as possible