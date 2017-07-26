import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ImageListing } from "./Image";
import { ContainerListing } from "./Container";
import { Sidebar } from "./App";
import registerServiceWorker from "./registerServiceWorker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
/*
ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(<Sidebar />, document.getElementById("test"));
*/
ReactDOM.render(
  <div>
    <MuiThemeProvider>
      <div>
        <Sidebar />
        <BrowserRouter>
          <div>
            <Route path="/images" component={ImageListing} />
            <Route path="/containers" component={ContainerListing} />
          </div>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  </div>,
  document.getElementById("root")
);

registerServiceWorker();
