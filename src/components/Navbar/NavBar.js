import React, { Component, Children, PropTypes } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import { Button } from "semantic-ui-react";
import History from "../History/History.js";
import Window from "../Window/Window.js";
// import Wifi_connect from "./components/Wifi_authentication/Wifi_connect.js";
import { Home } from "../../Home";
import "../../App.css";
import logo from "../../utils/vw_logo.png";

// this method is for navbar and rndered on all pages
export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectArray: [
        { key: "Option 1", cat: "Group 1" },
        { key: "Option 2", cat: "Group 1" },
        { key: "Option 3", cat: "Group 1" },
        { key: "Option 4", cat: "Group 2" },
        { key: "Option 5", cat: "Group 2" },
        { key: "Option 6", cat: "Group 2" },
        { key: "Option 7", cat: "Group 2" },
        { key: "Option 8", cat: "Group 2" },
        { key: "Option 9", cat: "Group 2" },
        { key: "Option 10", cat: "Group 2" },
        { key: "Option 11", cat: "Group 2" },
        { key: "Option 12", cat: "Group 2" },
        { key: "Option 13", cat: "Group 2" },
        { key: "Option 14", cat: "Group 2" },
      ],
    };
    this.style = {
      searchBox: {
        border: "none",
        "border-bottom": "1px solid blue",
        "border-radius": "0px",
      },
    };
  }
  render() {
    // const [field, setField] = useState([]);
    const { objectArray } = this.state;
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
              <div className="me-auto-tags">
                <Nav className="me-auto ">
                  <Multiselect
                    options={objectArray}
                    displayValue="key"
                    showCheckbox={true}
                  />
                  {/* <Nav.Link as={Link} to="/home">
                    Home
                  </Nav.Link> */}
                  {/* <Nav.Link as={Link} to="/history">
                    History
                  </Nav.Link> */}

                  {/* <Nav.Link as={Link} to="/window">
                    Pricing
                  </Nav.Link> */}
                </Nav>
              </div>
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
          <Route path="/window">
            <Window />
          </Route>
        </Switch>
      </Router>
    );
  }
}
