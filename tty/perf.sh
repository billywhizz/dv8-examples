rm -f perf.data
#dd if=/dev/zero bs=65536 count=100000 | sudo perf record dv8 count.js
dd if=/dev/zero bs=65536 count=1000 | sudo perf record dv8 pipe.js | dv8 count.js
sudo perf report --stdio

