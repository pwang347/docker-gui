export TAG=${TAG:-latest}
export PORT=${PORT:-3000}

usage(){
echo "
GENERAL:
./exec_container.sh <flags> <command>

COMMANDS:
build - install go binary and build the docker-gui container
run - run the latest tag for docker-gui-server

FLAGS:
-t	TAG	    Image tag for Docker
-p	PORT	Port for frontend server
"
}

err(){
    echo "$1"
    exit 1
}

while getopts "t:p:" arg; do
    case $arg in
        t) export TAG=${OPTARG}; shift; shift;;
        p) export PORT=${OPTARG}; shift; shift;;
    esac
done

if [ "$1" == "build" ]; then
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ./dg-backend/docker-gui-server ./dg-backend/docker-gui-server.go || {
        err "Failed to build Go binary"
    }
    docker build . -t docker-gui-server:"$TAG" || {
        err "Failed to build docker image"
    }
elif [ "$1" == "run" ]; then
    docker run -it -v /var/run/docker.sock:/var/run/docker.sock -p:"$PORT":3000 docker-gui-server:"$TAG" || {
        err "Failed to run docker image"
    }
else
    usage
fi
