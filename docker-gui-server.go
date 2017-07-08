// Copyright 2010 The Go Authors. All rights reserved.

// Use of this source code is governed by a BSD-style

// license that can be found in the LICENSE file.

package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/docker-gui/docker/container"
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

type dockerCommand func(*client.Client, url.Values) ([]byte, error)
type dockerTargetedCommand func(*client.Client, string, url.Values) ([]byte, error)
type errorResponse struct {
	Error string `json:"error"`
}

var containerCommands = map[string]dockerCommand{
	"list": container.List,
	"run":  container.Run,
}
var containerTargetedCommands = map[string]dockerTargetedCommand{
	"logs": container.Logs,
	"stop": container.Stop,
}
var imageCommands = map[string]dockerCommand{}
var imageTargetedCommands = map[string]dockerTargetedCommand{}

func containerHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if cmd, ok := containerCommands[vars["action"]]; ok {
		var (
			data []byte
			err  error
		)
		if data, err = cmd(dockerClient, r.URL.Query()); err != nil {
			data, _ = json.Marshal(errorResponse{Error: err.Error()})
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
		w.WriteHeader(http.StatusOK)
	} else {
		http.NotFound(w, r)
		return
	}
}

func containerTargetedHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if cmd, ok := containerTargetedCommands[vars["action"]]; ok {
		var (
			data []byte
			err  error
		)
		if data, err = cmd(dockerClient, vars["id"], r.URL.Query()); err != nil {
			data, _ = json.Marshal(errorResponse{Error: err.Error()})
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
		w.WriteHeader(http.StatusOK)
	} else {
		http.NotFound(w, r)
		return
	}
}

func imageHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if cmd, ok := imageCommands[vars["action"]]; ok {
		var (
			data []byte
			err  error
		)
		if data, err = cmd(dockerClient, r.URL.Query()); err != nil {
			data, _ = json.Marshal(errorResponse{Error: err.Error()})
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
		w.WriteHeader(http.StatusOK)
	} else {
		http.NotFound(w, r)
		return
	}
}

func imageTargetedHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	if cmd, ok := imageTargetedCommands[vars["action"]]; ok {
		var (
			data []byte
			err  error
		)
		if data, err = cmd(dockerClient, vars["id"], r.URL.Query()); err != nil {
			data, _ = json.Marshal(errorResponse{Error: err.Error()})
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
		w.WriteHeader(http.StatusOK)
	} else {
		http.NotFound(w, r)
		return
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
	r.HandleFunc("/api/containers/{action}", containerHandler)
	r.HandleFunc("/api/images/{action}", imageHandler)
	r.HandleFunc("/api/containers/{id}/{action}", containerTargetedHandler)
	r.HandleFunc("/api/images/{id}/{action}", imageTargetedHandler)
	http.Handle("/", r)

	fmt.Println(fmt.Sprintf("Starting docker-gui webserver at http://localhost:%d...", *port))
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", *port), handlers.LoggingHandler(os.Stdout, r)))
}
