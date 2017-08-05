import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./app/App";
import registerServiceWorker from "./registerServiceWorker";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

ReactDOM.render(
  <div>
    <MuiThemeProvider>
      <div>
        <App />
      </div>
    </MuiThemeProvider>
  </div>,
  document.getElementById("root")
);

registerServiceWorker();
