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
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import { truncateLongString, BACKEND_ROOT_URL } from "../common";

export class ImageView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      dialogOpen: false,
      selectedRow: 0,
      count: 0,
      images: []
    };
  }

  componentDidMount() {
    var self = this;
    var url = BACKEND_ROOT_URL + "/api/images/list";
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(json) {
        console.log("Updated image list", json);
        return json;
      })
      .then(function(json) {
        self.setState({ ready: true, count: json.count, images: json.images });
      })
      .catch(function(ex) {
        self.setState({ ready: true, count: 0, images: [] });
        throw ex;
      });
  }

  selectImage(key) {
    this.setState({ selectedRow: key });
  }

  startContainerForSelectedImage(ports, mounts, action) {
    var key = this.state.selectedRow;
    var selectedImage = this.state.images[key];
    if (selectedImage === undefined) {
      return;
    }
    this.props.toast(
      "Running image " +
        truncateLongString(selectedImage.repotags, 5) +
        " [Ports]: " +
        this.state.runPort +
        " [Mounts]: " +
        this.state.runMount +
        " [Action]: " +
        this.state.runAction,
      "info"
    );
    var self = this;
    var url = BACKEND_ROOT_URL + "/api/images/run?id=" + selectedImage.id;
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(json) {
        console.log("Retrieved ID of running container", json);
        return json;
      })
      .then(function(json) {
        self.props.toast(
          "Started container " +
            truncateLongString(json.container.id, 5) +
            " for image " +
            selectedImage.repotags,
          "success"
        );
      });
  }

  renderTable() {
    return (
      <div>
        <Table onRowSelection={this.selectImage.bind(this)}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Tags</TableHeaderColumn>
              <TableHeaderColumn>ID</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} deselectOnClickaway={false}>
            {this.state.images.map((image, index) =>
              <TableRow key={index} selected={this.state.selectedRow == index}>
                <TableRowColumn>
                  {image.repotags.join(", ")}
                </TableRowColumn>
                <TableRowColumn>
                  {image.id}
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <RaisedButton
          label="Run"
          primary={true}
          onClick={this.openRunDialog.bind(this)}
        />
      </div>
    );
  }
  openRunDialog() {
    this.setState({ dialogOpen: true });
  }
  renderRunDialog() {
    const actions = [
      <FlatButton
        type="reset"
        label="Reset"
        secondary={true}
        style={{ float: "left" }}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton type="submit" label="Run" primary={true} />
    ];
    const image =
      this.state.images.length > 0
        ? this.state.images[this.state.selectedRow].repotags.join(", ")
        : "null";
    return (
      <Dialog title={"Run " + image} modal={true} open={this.state.dialogOpen}>
        <form
          action="/"
          method="POST"
          onSubmit={e => {
            e.preventDefault();
            this.startContainerForSelectedImage();
            this.handleClose();
          }}
        >
          Set container configurations before running
          <br />
          <TextField
            name="ports"
            hintText="Ports (space separated)"
            value={this.state.runPort}
            onChange={this.handlePortChange.bind(this)}
          />
          <br />
          <TextField
            name="mounts"
            hintText="Mounts (space separated)"
            value={this.state.runMount}
            onChange={this.handleMountChange.bind(this)}
          />
          <br />
          <TextField
            name="action"
            hintText="Run action"
            value={this.state.runAction}
            onChange={this.handleActionChange.bind(this)}
          />
          <div
            style={{
              textAlign: "right",
              padding: 8,
              margin: "24px -24px -24px -24px"
            }}
          >
            {actions}
          </div>
        </form>
      </Dialog>
    );
  }
  handleClose() {
    this.setState({ dialogOpen: false });
  }
  handlePortChange(e) {
    this.setState({ runPort: e.target.value });
  }
  handleMountChange(e) {
    this.setState({ runMount: e.target.value });
  }
  handleActionChange(e) {
    this.setState({ runAction: e.target.value });
  }
  render() {
    return (
      <div>
        {this.state.dialogOpen ? this.renderRunDialog() : <div />}
        {this.state.ready ? this.renderTable() : <CircularProgress />}
      </div>
    );
  }
}
