import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ImageListing } from "./Image";
import { Sidebar } from "./App";
import registerServiceWorker from "./registerServiceWorker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import AppBar from "material-ui/AppBar";
/*
ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<Sidebar />, document.getElementById("test"));
*/
ReactDOM.render(
  <div>
    <MuiThemeProvider>
      <div>
        <div style={{ "padding-left": "256px" }}>
          <AppBar
            title="Title"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        </div>
        <Sidebar />
        <ImageListing subreddit="reactjs" />
      </div>
    </MuiThemeProvider>
  </div>,
  document.getElementById("root")
);

registerServiceWorker();
