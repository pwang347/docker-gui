package image

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"

	"github.com/docker-gui/dg-backend/common"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

// ListResponse is the data returned by the List endpoint
type ListResponse struct {
	Count  int               `json:"count"`
	Images []common.ImageObj `json:"images"`
}

// List shows list of images
func List(cli *client.Client, params url.Values) (data []byte, err error) {
	var (
		response = ListResponse{Count: 0, Images: []common.ImageObj{}}
	)
	options := types.ImageListOptions{}
	var images []types.ImageSummary
	if images, err = cli.ImageList(context.Background(), options); err != nil {
		return
	}
	for _, image := range images {
		fmt.Println(image.ID)
		response.Images = append(response.Images, common.ImageObj{ID: common.StripIDPrefix(image.ID), RepoTags: image.RepoTags})
	}
	response.Count = len(images)
	data, err = json.Marshal(response)
	return
}
