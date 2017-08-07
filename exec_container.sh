usage(){
echo "
GENERAL:
./exec_container.sh <flags> <command>

COMMANDS:
build - install go binary and build the docker-gui container
run - run the latest tag for docker-gui-server

FLAGS:
-t	TAG	        Image tag for Docker
-f	F_PORT	        Port for frontend server
-b      B_PORT          Port for backend server
-s      SKIP_COMPILE    Skip Go compile in build
"
}

err(){
    echo "$1" >&2
    exit 1
}

while getopts "t:f:b:snl:" arg; do
    case $arg in
        s) export SKIP_COMPILE=true;;
        n) export NO_CACHE=true;;
        t) export TAG=${OPTARG};;
        f) export F_PORT=${OPTARG};;
        b) export B_PORT=${OPTARG};;
        l) export LOG_DIR=${OPTARG};;
    esac
done

COMMAND="${@: -1}"

# Some env defaults
TAG=${TAG:-latest}
F_PORT=${F_PORT:-3000}
B_PORT=${B_PORT:-8080}

# Config used for run command
LOG_CONFIG="-v ${LOG_DIR}:/app/log/"
ENV_CONFIG="-e REACT_APP_BACKEND_ROOT_URL=http://localhost:${B_PORT}"
MOUNT_CONFIG="-v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):/bin/docker $([[ -n $LOG_DIR ]] && echo $LOG_CONFIG)"
PORT_CONFIG="-p:${F_PORT}:3000 -p:${B_PORT}:8080"

if [ "$COMMAND" == "build" ]; then
    if [[ "$SKIP_COMPILE" != true ]]; then
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o ./dg-backend/docker-gui-server ./dg-backend/docker-gui-server.go || {
        err "Failed to build Go binary"
    }
    fi
    docker build . $([[ -n $NO_CACHE ]] && echo "--no-cache") -t docker-gui:"$TAG" || {
        err "Failed to build docker image"
    }
elif [ "$COMMAND" == "run" ]; then
    docker run -it $ENV_CONFIG $MOUNT_CONFIG $PORT_CONFIG docker-gui:"$TAG" || {
        err "Failed to run docker image"
    }
elif [ "$COMMAND" == "tagremote" ]; then
    docker tag docker-gui:"$TAG" pwang347/docker-gui:"$TAG"
elif [ "$COMMAND" == "push" ]; then
    docker push pwang347/docker-gui:"$TAG"
else
    usage
fi
