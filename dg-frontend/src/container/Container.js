import React from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import CircularProgress from "material-ui/CircularProgress";
import RaisedButton from "material-ui/RaisedButton";
import { truncateLongString, BACKEND_ROOT_URL } from "../common";

export class ContainerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      selectedRow: 0,
      count: 0,
      containers: []
    };
  }

  refresh() {
    var self = this;
    var url = BACKEND_ROOT_URL + "/api/containers/list";
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(json) {
        console.log("Updated container list", json);
        return json;
      })
      .then(function(json) {
        self.setState({
          ready: true,
          count: json.count,
          containers: json.containers
        });
      })
      .catch(function(ex) {
        self.setState({ ready: true, count: 0, containers: [] });
        throw ex;
      });
  }

  componentDidMount() {
    this.refresh.bind(this);
    this.interval = setInterval(this.refresh.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  removeContainer() {
    var key = this.state.selectedRow;
    var containers = this.state.containers;
    if (
      containers[key] == undefined ||
      containers[key].disabled !== undefined
    ) {
      this.props.toast("This container is already being removed", "error");
      return;
    }
    /* This doesn't actually get the docker-gui tag; might need to request it later
    For now it's a feature, heh.
    if (containers[key].image.includes("docker-gui:")) {
      this.props.toast(
        "Ha. You can't stop the docker GUI container unfortunately.",
        "warning"
      );
      return;
    }*/
    containers[key].disabled = true;
    var containerToRemoveID = containers[key].id;
    this.setState({
      containers: containers
    });
    this.props.toast(
      "Removing container " + truncateLongString(containerToRemoveID, 5),
      "info"
    );
    var self = this;
    var url =
      BACKEND_ROOT_URL + "/api/containers/stop?id=" + containerToRemoveID;
    fetch(url)
      .catch(function(ex) {
        self.props.toast(
          "Unexpected fetch error while trying to stop " + containerToRemoveID,
          "error"
        );
        var containers = self.state.containers;
        containers[key].disabled = undefined;
        self.setState({
          containers: containers
        });
      })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(json) {
        console.log("ID of stopped container", json);
        return json;
      })
      .then(function(json) {
        // Not needed since polling is enabled.
        /*
        var containers = self.state.containers;
        var containerToRemove = containers.find(container => {
          return container.id == containerToRemoveID;
        });
        var removeKey = containers.indexOf(containerToRemove);
        if (removeKey == -1) {
          console.log(
            "Bad one was " +
              JSON.stringify(containerToRemove) +
              " for " +
              JSON.stringify(containers)
          );
          throw new Error(
            "Panic: seems to be a race condition with removing containers"
          );
        }
        containers.splice(removeKey, 1);
        self.setState({
          containers: containers
        });*/
        self.props.toast(
          "Removed container " + truncateLongString(containerToRemoveID, 5),
          "success"
        );
      });
  }

  selectContainer(key) {
    if (key !== undefined) this.setState({ selectedRow: key[0] }); // this is an array of all selected; but we've only enabled one at a time
  }

  renderTable() {
    return (
      <div>
        <Table onRowSelection={this.selectContainer.bind(this)}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Container ID</TableHeaderColumn>
              <TableHeaderColumn>Image ID</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} deselectOnClickaway={false}>
            {this.state.containers.map((container, index) =>
              <TableRow
                key={index}
                /*style={
                  container.disabled !== undefined
                    ? { backgroundColor: "#FF0000" }
                    : {}
                }*/
                selected={this.state.selectedRow == index}
              >
                <TableRowColumn>
                  {container.id}
                </TableRowColumn>
                <TableRowColumn>
                  {container.image}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <RaisedButton
          label="Stop container"
          primary={true}
          onClick={this.removeContainer.bind(this)}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.ready ? this.renderTable() : <CircularProgress />}
      </div>
    );
  }
}
