package container

import (
	"context"
	"encoding/json"
	"net/url"
	"strconv"

	"github.com/docker-gui/docker/common"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

const paramListLimit = "limit"
const defaultListLimit = "-1"

// ListResponse is the data returned by the List endpoint
type ListResponse struct {
	Count      int                   `json:"count"`
	Containers []common.ContainerObj `json:"containers"`
}

// List shows list of containers
func List(cli *client.Client, params url.Values) (data []byte, err error) {
	var (
		response  ListResponse
		listLimit int
	)
	if listLimit, err = strconv.Atoi(common.GetDefaultedParam(params, paramListLimit, defaultListLimit)); err != nil {
		return
	}
	options := types.ContainerListOptions{Limit: listLimit}
	var containers []types.Container
	if containers, err = cli.ContainerList(context.Background(), options); err != nil {
		return
	}
	for _, container := range containers {
		response.Containers = append(response.Containers, common.ContainerObj{ID: container.ID, Image: container.Image})
	}
	response.Count = len(containers)
	data, err = json.Marshal(response)
	return
}
