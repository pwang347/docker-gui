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

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const routes = {"/images": {name: "Images", component: function(){return <ImageView/>} },
"/containers": {name: "Containers", component: function(){return <ContainerView/>} },
"/dockerfiles": { name: "Dockerfiles", component: function(){return <DockerfileView/>}},
"/compose": { name: "Orchestration", component: function(){return <ComposeView/>} }}

const deltaStyle = {"paddingLeft": "272px"}

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirected: false,
      activeRoute: window.location.href.pathname // undefined until we click a different navigation tab
    };
  }
  selectRoute(route) {
    this.setState({ activeRoute: route, redirected: true });
  }
  renderFromActive(){
    return <Content title={routes[this.state.activeRoute].name} view={routes[this.state.activeRoute].component()}/>
  }
  renderFromRouter(){
  return <BrowserRouter>
            <div>
              {Object.keys(routes).map((key, index) =>
                <Route key={index} path={key} render={()=><Content title={routes[key].name} view={routes[key].component()}/>} />
              )}
            </div>
        </BrowserRouter>
  }
  render() {
    return (
      <div>
        <NavigationBar selectRoute={this.selectRoute.bind(this)} routes={routes} />
        <div style={deltaStyle}>
        {this.state.redirected ? this.renderFromActive() : this.renderFromRouter()}
        </div>
      </div>
    );
  }
}

class Content extends React.Component {
  render() {
    return <div>
      <Title data={this.props.title}/>
      {this.props.view}
      </div>
  }
}

class Title extends React.Component {
  render() {
    return <AppBar title={this.props.data} iconClassNameRight="muidocs-icon-navigation-expand-more" />
  }
}

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true, routes: props.routes
    };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <div>
        <Drawer open={this.state.open}>
          {Object.keys(this.state.routes).map((key, index) =>
            <MenuItem key={index} onClick={() => {
              if (window.location.pathname !== key) {
                window.history.pushState("", "", key);
                this.props.selectRoute(key)
              }
            }}
            >
            <p>{routes[key].name}</p>
            </MenuItem>
          )}
        </Drawer>
      </div>
    );
  }
}