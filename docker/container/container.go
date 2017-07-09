package container

import (
	"errors"
	"net/url"
)

const paramContainerID = "id"

type containerObj struct {
	ID    string `json:"id"`
	Image string `json:"image"`
}

func getRequiredParam(params url.Values, paramName string) (val string, err error) {
	return getParam(params, paramName, true, "")
}

func getDefaultedParam(params url.Values, paramName string, defaultVal string) (val string) {
	val, _ = getParam(params, paramName, false, defaultVal)
	return
}

func getParam(params url.Values, paramName string, required bool, defaultVal string) (val string, err error) {
	val = params.Get(paramName)
	if val == "" {
		if required {
			err = errors.New("missing required " + paramName + " param")
			return
		}
		val = defaultVal
	}
	return
}
