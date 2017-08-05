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

export class ImageView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      count: 0,
      images: []
    };
  }

  componentDidMount() {
    var self = this;
    var url = "http://localhost:8080/api/images/list";
    fetch(url)
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function (json) {
        console.log("parsed json", json);
        self.setState({ ready: true, count: json.count, images: json.images });
      })
      .catch(function (ex) {
        self.setState({ ready: true, count: 0, images: [] });
        throw new Error(`Could not parse json from {url}`);
      });
  }

  renderTable(){
    return <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Tags</TableHeaderColumn>
                  <TableHeaderColumn>ID</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.images.map((data, index) =>
                  <TableRow key={index}>
                    <TableRowColumn>
                      {data.repotags.join(", ")}
                    </TableRowColumn>
                    <TableRowColumn>
                      {data.id}
                    </TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
  }
  render() {
    return (
      <div>
        {this.state.ready ? this.renderTable() : <CircularProgress />}
      </div>
    );
  }
}
