package health

import (
	"encoding/json"
	"net/url"

	"github.com/docker/docker/client"
)

// SummaryResponse is the data returned by the List endpoint
type SummaryResponse struct {
	Status string `json:"status"`
}

// Summary returns the backend health status
func Summary(cli *client.Client, params url.Values) (data []byte, err error) {
	var (
		response = SummaryResponse{Status: "OK"}
	)
	// TODO: check docker connectivity
	data, err = json.Marshal(response)
	return
}
