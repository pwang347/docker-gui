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

export class ImageListing extends React.Component {
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
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(function(json) {
        console.log("parsed json", json);
        self.setState({ ready: true, count: json.count, images: json.images });
      })
      .catch(function(ex) {
        self.setState({ ready: true, count: 0, images: [] });
        throw new Error(`Could not parse json from {url}`);
      });
  }

  render() {
    return (
      <div style={{ "padding-left": "256px" }}>
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
                  {this.state.images.map((data, index) =>
                    <TableRow>
                      <TableRowColumn>
                        {index + 1}
                      </TableRowColumn>
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
            </div>
          : <CircularProgress />}
      </div>
    );
  }
}

class ImageTable extends React.Component {
  render() {
    /* the ES6 version of const data = this.props.data */
    const { data } = this.props;
    /* 
    use map to perform the same function on    
    each element in the obj array
    */
    const row = data.map((data, index) =>
      <tr key={"row" + index}>
        <td key={"index" + index}>
          {index + 1}
        </td>
        <td key={data.repotags}>
          {data.repotags}
        </td>
        <td key={data.id}>
          {data.id}
        </td>
      </tr>
    );
    return (
      <table>
        <tbody>
          <tr>
            <th>Index</th>
            <th>Tags</th>
            <th>ID</th>
          </tr>
          {row}
        </tbody>
      </table>
    );
  }
}
