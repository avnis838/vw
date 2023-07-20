import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import History from "../History/History.js";

import "../../App.css";
import logo from "../../utils/vw_logo.png";
// import Select_topicState from "../../context/Select_topic/Select_topicState.js";

// this method is for navbar and rndered on all pages
export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.style = {
      searchBox: {
        border: "none",
        "border-bottom": "1px solid blue",
        "border-radius": "0px",
      },
    };
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar bg="dark" variant="dark" className="Nav">
            <div class="container-fluid">
              <img src={logo} alt="Logo" className="pad" />
              <Navbar.Brand href="/" className="Navbrand">
                <span className="red-letter">V</span>olt
                <span className="red-letter w-letter">W</span>orks
              </Navbar.Brand>
              <div style={{ color: "#7abb01" }}>Nodia, UP</div>
            </div>
          </Navbar>
        </div>
        <Switch>
          {/* <Route exact path="/">
            <Home />
          </Route> */}
          <Route path="/">
            <History />
          </Route>
          {/* <Route path="/window">
            <Window />
          </Route> */}
          {/* <Route path="/connect">
            <Wifi_connect />
          </Route> */}
          <Route path="/window"></Route>
        </Switch>
      </Router>
    );
  }
}
