import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import { Button } from "semantic-ui-react";
import History from "../History/History.js";
import Window from "../Window/Window.js";
// import Wifi_connect from "./components/Wifi_authentication/Wifi_connect.js";
import { Home } from "../../Home";
import "../../App.css";

export default class NavBar extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar bg="dark" variant="dark" className="Nav">
            <Navbar.Brand href="/" className="Navbrand">
              VoltWorks
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/history">
                History
              </Nav.Link>

              <Nav.Link as={Link} to="/window">
                Pricing
              </Nav.Link>
            </Nav>
          </Navbar>
        </div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route path="/window">
            <Window />
          </Route>
          {/* <Route path="/connect">
            <Wifi_connect />
          </Route> */}
          <Route path="/window">
            <Window />
          </Route>
        </Switch>
      </Router>
    );
  }
}
