import React from "react";
import "./App.css";
import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";
import injectTapEventPlugin from "react-tap-event-plugin";
import AppBar from "material-ui/AppBar";
import { ImageView } from "../image/Image";
import { ContainerView } from "../container/Container";
import { DockerfileView } from "../dockerfile/Dockerfile";
import { ComposeView } from "../orchestration/Compose";
import { Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { BACKEND_ROOT_URL } from "../common";

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const routes = {
  "/": {
    name: "Overview",
    component: function(toastFn) {
      return <p>Welcome!</p>;
    }
  },
  "/images": {
    name: "Images",
    component: function(toastFn) {
      return <ImageView toast={toastFn} />;
    }
  },
  "/containers": {
    name: "Containers",
    component: function(toastFn) {
      return <ContainerView toast={toastFn} />;
    }
  },
  "/dockerfiles": {
    name: "Dockerfiles",
    component: function(toastFn) {
      return <DockerfileView toast={toastFn} />;
    }
  },
  "/compose": {
    name: "Orchestration",
    component: function(toastFn) {
      return <ComposeView toast={toastFn} />;
    }
  }
};

const STYLE_PADDED = { paddingLeft: "272px" };
const STYLE_ABOVE = {
  position: "fixed",
  zIndex: 999999
};

const MAX_HEALTH_CHECKS = 5;

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backendOkay: undefined,
      failedPings: 0,
      redirected: false,
      activeRoute: window.location.href.pathname // undefined until we click a different navigation tab
    };
  }
  notify(msg, level = "default") {
    switch (level) {
      case "success":
        toast.success(msg);
        break;
      case "info":
        toast.info(msg);
        break;
      case "warn":
        toast.warn(msg);
        break;
      case "error":
        toast.error(msg);
        break;
      default:
        toast(msg);
    }
  }
  selectRoute(route) {
    this.setState({ activeRoute: route, redirected: true });
  }
  renderFromActive() {
    return (
      <Content
        title={routes[this.state.activeRoute].name}
        view={routes[this.state.activeRoute].component(this.notify.bind(this))}
      />
    );
  }
  renderFromRouter() {
    return (
      <BrowserRouter>
        <div>
          {Object.keys(routes).map((key, index) =>
            <Route
              exact
              key={index}
              path={key}
              render={() =>
                <Content
                  title={routes[key].name}
                  view={routes[key].component(this.notify.bind(this))}
                />}
            />
          )}
        </div>
      </BrowserRouter>
    );
  }
  healthcheck() {
    if (
      this.state.backendOkay === true ||
      this.state.failedPings === MAX_HEALTH_CHECKS
    ) {
      clearInterval(this.interval);
      return;
    }
    var self = this;
    var url = BACKEND_ROOT_URL + "/api/health/summary";
    fetch(url)
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .catch(this.failedCheck.bind(this))
      .then(function(json) {
        self.setState({
          backendOkay: true
        });
        console.log("Health check OK", json);
        return json;
      })
      .catch(this.failedCheck.bind(this));
  }
  failedCheck(ex) {
    this.setState({
      failedPings: this.state.failedPings + 1
    });
    if (this.state.failedPings === MAX_HEALTH_CHECKS) {
      this.setState({
        backendOkay: false
      });
    }
  }
  componentDidMount() {
    this.healthcheck.bind(this);
    this.interval = setInterval(this.healthcheck.bind(this), 1000);
  }
  componentWillUnmount() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
  render() {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          style={STYLE_ABOVE}
        />
        <NavigationBar
          selectRoute={this.selectRoute.bind(this)}
          routes={routes}
        />
        <div style={STYLE_PADDED}>
          {this.state.backendOkay === false
            ? <p>Error! Cannot connect to the backend server.</p>
            : this.state.redirected
              ? this.renderFromActive()
              : this.renderFromRouter()}
        </div>
      </div>
    );
  }
}

class Content extends React.Component {
  render() {
    return (
      <div>
        <Title data={this.props.title} />
        {this.props.view}
      </div>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
      <AppBar
        title={this.props.data}
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    );
  }
}

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      routes: props.routes
    };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <div>
        <Drawer open={this.state.open}>
          {Object.keys(this.state.routes).map((key, index) =>
            <MenuItem
              key={index}
              onClick={() => {
                if (window.location.pathname !== key) {
                  window.history.pushState("", "", key);
                  this.props.selectRoute(key);
                }
              }}
            >
              <p>
                {routes[key].name}
              </p>
            </MenuItem>
          )}
        </Drawer>
      </div>
    );
  }
}
