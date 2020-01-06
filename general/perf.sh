dv8 --trace-gc-verbose --trace-opt-verbose --trace-opt --trace-file-names --trace-opt-stats --print-opt-source --mcpu=x64 --trace-turbo-loop --trace-turbo --trace-turbo-inlining --trace-idle-notification-verbose --stack-trace-on-illegal --trace-minor-mc-parallel-marking ipcfast.js 65536 10 8 2>err.log 1>out.log
rm *.json
rm *.cfg
rm -f perf.data
sudo perf record dv8 ipcfast.js 65536 10 8
sudo perf report --stdio
