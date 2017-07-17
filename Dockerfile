FROM node:boron

# Copy frontend source
COPY ./dg-frontend /app
# Copy backend binary
COPY ./dg-backend/docker-gui-server /app/
# Copy scripts
COPY ./docker/* /app/scripts/

RUN echo "Directory setup" && \
    mkdir /app/log && \
    echo "Install dependencies" && \
    cd /app && npm install

EXPOSE 3000
CMD ["/app/scripts/run.sh"]
