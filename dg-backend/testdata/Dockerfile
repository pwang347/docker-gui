FROM ubuntu:16.04
CMD echo "Started" && trap 'echo "Shutting down..." && exit' INT; sleep infinity & wait
