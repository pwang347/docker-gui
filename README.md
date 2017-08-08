# Docker GUI
Web control utility for managing Docker containers and images.

Developed using ReactJS client and Golang backend.

# Usage
docker run -it -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/bin/docker -p:3000:3000 -p:8080:8080 pwang347/docker-gui:latest

For additional options, see `exec_container.sh`
