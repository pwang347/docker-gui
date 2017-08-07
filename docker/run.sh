#!/bin/bash
# Allow pre-emptive termination via sigint
trap 'echo "Shutting down..." && exit' INT
# Run the docker-gui backend server and log to file
/app/docker-gui-server 2>&1 | tee /app/log/dg-backend.log &
# Client needs to know where the backend server is
export REACT_APP_BACKEND_ROOT_URL=${REACT_APP_BACKEND_ROOT_URL:-http://localhost:8080}
# Run the docker-gui frontend client and log to file
npm start --prefix /app 2>&1 | tee /app/log/dg-frontend.log &
wait
