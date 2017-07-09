FROM scratch
ADD ca-certificates.crt /etc/ssl/certs/
ADD docker-gui-server /
EXPOSE 8080
CMD ["./docker-gui-server"]
