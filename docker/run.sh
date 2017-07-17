# Allow pre-emptive termination via sigint
trap 'echo "Shutting down..." && exit' INT
# Run the docker-gui backend server and log to file
/app/docker-gui-server 2>&1 >> /app/log/dg-backend.log &
# Run the docker-gui frontend server and log to file
npm start --prefix /app 2>&1 >> /app/log/dg-frontend.log &
wait
