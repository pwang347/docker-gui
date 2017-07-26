import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import RaisedButton from "material-ui/RaisedButton";
import injectTapEventPlugin from "react-tap-event-plugin";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: true };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <div>
        <RaisedButton label="Toggle Drawer" onTouchTap={this.handleToggle} />
        <Drawer open={this.state.open} docked="true">
          <MenuItem
            onClick={() => {
              if (window.location.pathname != "/images") {
                window.location.replace("/images");
              }
            }}
          >
            Images
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (window.location.pathname != "/containers") {
                window.location.replace("/containers");
              }
            }}
          >
            Containers
          </MenuItem>
        </Drawer>
      </div>
    );
  }
}
