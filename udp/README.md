## dns.js
udp dns module using google's 8.8.8.8 service, used by server.js and client.js

## server.js
udp server for receiving TURN-like requests for UDP hole punching

## client.js
udp hole punching client

## tftp.js
run the tftp server to listen for files (will need sudo to listen on tftp port)
```
sudo dv8 tftp.js
```

run a tftp client to send the file to the server, where 127.0.0.1 is the ip address of the machine the tftp server is running on
```
atftp --option "blksize 65464" -p -l /this/is/a/test/file --verbose 127.0.0.1
```