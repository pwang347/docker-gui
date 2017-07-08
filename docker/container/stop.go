package container

import (
	"context"
	"encoding/json"
	"net/url"
	"time"

	"github.com/docker/docker/client"
)

// StopResponse is the data returned by the Stop endpoint
type StopResponse struct {
	Container containerObj `json:"container"`
}

// Stop stops a running container and returns its id
func Stop(cli *client.Client, id string, params url.Values) (data []byte, err error) {
	var (
		response StopResponse
		timeout  = time.Duration(5) * time.Second
	)
	if err = cli.ContainerStop(context.Background(), id, &timeout); err != nil {
		return
	}
	response.Container = containerObj{ID: id}
	data, err = json.Marshal(response)
	return
}
