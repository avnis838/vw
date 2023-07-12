import React, { Component, Children, PropTypes } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Link, Route } from "react-router-dom";

import History from "../History/History.js";

import "../../App.css";
import logo from "../../utils/vw_logo.png";
// import Select_topicState from "../../context/Select_topic/Select_topicState.js";

// this method is for navbar and rndered on all pages
export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectArray: [
        { key: "Temperature", cat: "Group 1" },
        { key: "Voltage", cat: "Group 1" },
        { key: "Current", cat: "Group 1" },
        { key: "Speed", cat: "Group 2" },
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
      selectedValues: [],
      location: null,
      weather: null,
    };
    this.style = {
      searchBox: {
        border: "none",
        "border-bottom": "1px solid blue",
        "border-radius": "0px",
      },
    };
  }

  handleSelect = (selectedList, selectedItem) => {
    this.setState({ selectedValues: selectedList });
  };

  render() {
    // const [field, setField] = useState([]);
    var location = this.state.location;
    var weather = this.state.weather;
    const { objectArray } = this.state.objectArray;
    const { selectedValues } = this.state.selectedValues;
    function handleLocationClick() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation not supported");
      }
    }

    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      location = { latitude, longitude };
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

      // Make API call to OpenWeatherMap
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${"9946e55abecf363825843cff69fd8212"}&units=metric`
      )
        .then((response) => response.json())
        .then((data) => {
          weather = data;
          console.log(data);
        })
        .catch((error) => console.log(error));
    }

    function error() {
      console.log("Unable to retrieve your location");
    }
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
              <div style={{ color: "white" }}>
                {!location ? (
                  <button onClick={handleLocationClick}>Get Location</button>
                ) : null}
                {location && !weather ? <p>Loading weather data...</p> : null}
                {weather ? (
                  <div>
                    <p>Location: {weather.name}</p>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                  </div>
                ) : null}
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
          <Route path="/window"></Route>
        </Switch>
      </Router>
    );
  }
}
