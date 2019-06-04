## count.js

Counts bytes on stdin

```
cd tty
dd if=/dev/zero bs=65536 count=1000000 | dv8 count.js
```

## pipe.js

Pipes stdin to stdout (same as 'cat')

```
cd tty
dd if=/dev/zero bs=65536 count=1000000 | dv8 pipe.js | dv8 count.js
```

## repl.js

A rudimentary repl

```
cd tty
dv8 repl.js
```
