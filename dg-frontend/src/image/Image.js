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
import truncateLongString from "../common.js";

export class ImageView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      selectedRow: 0,
      count: 0,
      images: []
    };
  }

  componentDidMount() {
    var self = this;
    var url = "http://localhost:8080/api/images/list";
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(json) {
        console.log("parsed json", json);
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

  startContainerForSelectedImage() {
    var key = this.state.selectedRow;
    var selectedImage = this.state.images[key];
    if (selectedImage === undefined) {
      return;
    }
    this.props.toast(
      "Running image " + truncateLongString(selectedImage.repotags, 5),
      "info"
    );
    var self = this;
    var url = "http://localhost:8080/api/images/run?id=" + selectedImage.id;
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(json) {
        console.log("parsed json", json);
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
          onClick={this.startContainerForSelectedImage.bind(this)}
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
