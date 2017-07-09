package image

import (
	"context"
	"encoding/json"
	"net/url"

	"github.com/docker-gui/docker/common"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

// ListResponse is the data returned by the List endpoint
type ListResponse struct {
	Count  int               `json:"count"`
	Images []common.ImageObj `json:"images"`
}

// List shows list of containers
func List(cli *client.Client, params url.Values) (data []byte, err error) {
	var (
		response ListResponse
	)
	options := types.ImageListOptions{}
	var images []types.ImageSummary
	if images, err = cli.ImageList(context.Background(), options); err != nil {
		return
	}
	for _, image := range images {
		response.Images = append(response.Images, common.ImageObj{ID: image.ID})
	}
	response.Count = len(images)
	data, err = json.Marshal(response)
	return
}
