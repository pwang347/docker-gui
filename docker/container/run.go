package container

import (
	"encoding/json"
	"net/url"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"golang.org/x/net/context"
)

const (
	paramRunImage    string = "image"
	paramRunRegistry string = "registry"
)

const defaultRunRegistry string = "docker.io/library/"

// RunResponse is the data returned by the Run endpoint
type RunResponse struct {
	Container containerObj `json:"container"`
}

// Run starts a new container and returns its container id
func Run(cli *client.Client, params url.Values) (data []byte, err error) {
	ctx := context.Background()
	var (
		response RunResponse
		image    string
		registry string
	)
	if image, err = getRequiredParam(params, paramRunImage); err != nil {
		return
	}
	registry = getDefaultedParam(params, paramRunRegistry, defaultRunRegistry)
	if _, err = cli.ImagePull(ctx, registry+image, types.ImagePullOptions{}); err != nil {
		return
	}
	var resp container.ContainerCreateCreatedBody
	if resp, err = cli.ContainerCreate(ctx, &container.Config{
		Image: image,
		Cmd:   []string{},
	}, nil, nil, ""); err != nil {
		return
	}
	if err = cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		return
	}
	response.Container = containerObj{ID: resp.ID, Image: image}
	data, err = json.Marshal(response)
	return
}
