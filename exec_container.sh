export PORT=${PORT:-8080}

if [ "$1" == "build" ]; then
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o docker-gui-server
    docker build . -t docker-gui-server
elif [ "$1" == "run" ]; then
    docker run -it -v /var/run/docker.sock:/var/run/docker.sock -p:"$PORT":8080 docker-gui-server
fi
