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

export class ContainerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      count: 0,
      containers: []
    };
  }

  componentDidMount() {
    var self = this;
    var url = "http://localhost:8080/api/containers/list";
    fetch(url)
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function (json) {
        console.log("parsed json", json);
        self.setState({
          ready: true,
          count: json.count,
          containers: json.containers
        });
      })
      .catch(function (ex) {
        self.setState({ ready: true, count: 0, containers: [] });
        throw new Error(`Could not parse json from {url}`);
      });
  }

  render() {
    return (
      <div>
        {this.state.ready
          ? <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>Index</TableHeaderColumn>
                  <TableHeaderColumn>Tags</TableHeaderColumn>
                  <TableHeaderColumn>ID</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {this.state.containers.map((data, index) =>
                  <TableRow>
                    <TableRowColumn>
                      {index + 1}
                    </TableRowColumn>
                    <TableRowColumn>
                      {data.image}
                    </TableRowColumn>
                    <TableRowColumn>
                      {data.id}
                    </TableRowColumn>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          : <CircularProgress />}
      </div>
    );
  }
}
