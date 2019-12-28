## app.js

run this app and it should have a debugger listening on port 9222 which you can connect to using vscode launch.json:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "attach",
            "name": "Attach to Remote",
            "address": "127.0.0.1",
            "port": 9222,
            "localRoot": "${workspaceFolder}",
            "remoteRoot": "${workspaceFolder}/debugger"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "cwd": "${workspaceFolder}/debugger",
            "console": "integratedTerminal",
            "protocol": "inspector",
            "env": {
                "THREAD_BUFFER_SIZE": "67108864" // this is a hack for now
            },
            "port": "9222",
            "runtimeExecutable": "/usr/local/bin/dv8",
            "program": "${workspaceFolder}/debugger/app.js"
        }
    ]
}
```

## debug.js

debuger module. just a proof of concept

## util.js

various buffer encoding functions

# websocket.js

websocket library for wrapping a socket and creating websocket messages
