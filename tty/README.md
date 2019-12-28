## count.js

Counts bytes on stdin

```
dd if=/dev/zero bs=65536 count=1000000 | dv8 count.js
```

## pipe.js

Pipes stdin to stdout (same as 'cat')

```
dd if=/dev/zero bs=65536 count=1000000 | dv8 pipe.js | dv8 count.js
```

## repl.js

A rudimentary repl

```
dv8 repl.js
```

## jitter.js

measure the jitter in reading stdin

```
dd if=/dev/zero bs=65536 count=10000000 | dv8 jitter.js
```