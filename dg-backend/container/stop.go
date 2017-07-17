package container

import (
	"context"
	"encoding/json"
	"net/url"
	"strconv"
	"time"

	"github.com/docker-gui/dg-backend/common"
	"github.com/docker/docker/client"
)

const paramStopForce = "force"
const (
	defaultTimeoutDuration = time.Duration(5) * time.Second
	defaultStopForce       = "false"
)

// StopResponse is the data returned by the Stop endpoint
type StopResponse struct {
	Container common.ContainerObj `json:"container"`
}

// Stop stops a running container and returns its id
func Stop(cli *client.Client, params url.Values) (data []byte, err error) {
	var (
		response  StopResponse
		id        string
		timeout   = defaultTimeoutDuration
		forceStop bool
	)
	if id, err = common.GetRequiredParam(params, common.ParamID); err != nil {
		return
	}
	if forceStop, err = strconv.ParseBool(common.GetDefaultedParam(params, paramStopForce, defaultStopForce)); err != nil {
		return
	}
	if forceStop {
		if err = cli.ContainerKill(context.Background(), id, "SIGKILL"); err != nil {
			return
		}
	} else {
		if err = cli.ContainerStop(context.Background(), id, &timeout); err != nil {
			return
		}
	}
	response.Container = common.ContainerObj{ID: id}
	data, err = json.Marshal(response)
	return
}
