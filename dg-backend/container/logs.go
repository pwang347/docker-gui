package container

import (
	"context"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/url"
	"strconv"

	"github.com/ahmetb/dlog"
	"github.com/docker-gui/dg-backend/common"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

const paramLogTimestamp = "timestamp"
const defaultLogTimestamp = "false"

// LogsResponse is the data returned by the Logs endpoint.
type LogsResponse struct {
	Output    string              `json:"output"`
	Container common.ContainerObj `json:"container"`
}

// Logs returns the latest logs from a container.
func Logs(cli *client.Client, params url.Values) (data []byte, err error) {
	var (
		response     LogsResponse
		id           string
		logTimestamp bool
	)
	if id, err = common.GetRequiredParam(params, common.ParamID); err != nil {
		return
	}
	if logTimestamp, err = strconv.ParseBool(common.GetDefaultedParam(params, paramLogTimestamp, defaultLogTimestamp)); err != nil {
		return
	}
	options := types.ContainerLogsOptions{ShowStdout: true, ShowStderr: true, Timestamps: logTimestamp, Follow: false}
	var out io.ReadCloser
	if out, err = cli.ContainerLogs(context.Background(), id, options); err != nil {
		return
	}
	var b []byte
	b, err = ioutil.ReadAll(dlog.NewReader(out))
	response.Output = string(b)
	response.Container = common.ContainerObj{ID: id}
	data, err = json.Marshal(response)
	return
}
