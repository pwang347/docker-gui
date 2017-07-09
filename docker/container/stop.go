package container

import (
	"context"
	"encoding/json"
	"net/url"
	"strconv"
	"time"

	"github.com/docker/docker/client"
)

const paramStopForce = "force"
const defaultStopForce = "false"

// StopResponse is the data returned by the Stop endpoint
type StopResponse struct {
	Container containerObj `json:"container"`
}

// Stop stops a running container and returns its id
func Stop(cli *client.Client, params url.Values) (data []byte, err error) {
	var (
		response  StopResponse
		id        string
		timeout   = time.Duration(5) * time.Second
		forceStop bool
	)
	if id, err = getRequiredParam(params, paramContainerID); err != nil {
		return
	}
	if forceStop, err = strconv.ParseBool(getDefaultedParam(params, paramStopForce, defaultStopForce)); err != nil {
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
	response.Container = containerObj{ID: id}
	data, err = json.Marshal(response)
	return
}
