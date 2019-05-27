docker run -it --cap-add=NET_ADMIN --cap-add=SYS_ADMIN --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --rm -v $(pwd):/app -p 3000:3000 dv8 /bin/sh
