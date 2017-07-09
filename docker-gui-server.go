package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/docker-gui/docker/container"
	"github.com/docker-gui/docker/image"
	"github.com/docker/docker/client"
	"github.com/gorilla/mux"

	"net/http"

	"net/url"

	"github.com/gorilla/handlers"
)

var (
	dockerClient *client.Client
	ctx          context.Context
)

const errorNotFound = "not-found"

type dockerCommand func(cli *client.Client, params url.Values) ([]byte, error)
type errorResponse struct {
	Error string `json:"error"`
}

var containerCommands = map[string]dockerCommand{
	"list": container.List,
	"logs": container.Logs,
	"stop": container.Stop,
}
var imageCommands = map[string]dockerCommand{
	"list": image.List,
	"run":  image.Run,
}

func mapJSONEndpoints(commands map[string]dockerCommand) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		if cmd, ok := commands[vars["action"]]; ok {
			var (
				data []byte
				err  error
			)
			w.Header().Set("Content-Type", "application/json")
			data, err = cmd(dockerClient, r.URL.Query())
			if err != nil {
				if err.Error() == errorNotFound {
					http.NotFound(w, r)
					return
				}
				data, _ = json.Marshal(errorResponse{Error: err.Error()})
				w.WriteHeader(http.StatusInternalServerError)
				w.Write(data)
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Write(data)
			return
		}
		http.NotFound(w, r)
	}
}

func main() {
	var port = flag.Int("port", 8080, "webserver port")
	var apiVersion = flag.String("api-version", "1.24", "API version used by Docker engine; see `docker version`")
	flag.Parse()
	os.Setenv("DOCKER_API_VERSION", *apiVersion)

	var err error
	if dockerClient, err = client.NewEnvClient(); err != nil {
		panic(err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/api/containers/{action}", mapJSONEndpoints(containerCommands))
	r.HandleFunc("/api/images/{action}", mapJSONEndpoints(imageCommands))
	http.Handle("/", r)

	fmt.Println(fmt.Sprintf("Starting docker-gui webserver at http://localhost:%d...", *port))
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", *port), handlers.LoggingHandler(os.Stdout, r)))
}
