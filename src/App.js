import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import { Button } from "semantic-ui-react";
import History from "./components/History/History.js";
import Window from "./components/Window/Window.js";
import Wifi_connect from "./components/Wifi_authentication/Wifi_connect.js";
import { Home } from "./Home";
// import "semantic-ui-css/semantic.min.css";

const refresh = () => {
  window.location.reload();
};

function App() {
  return (
    <div className="App">
      <div className="heading">
        <p>VoltWorks Limited</p>
        <Button
          className="button"
          inverted
          color="blue"
          circular
          icon="refresh"
          onClick={refresh}
        />
      </div>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/history">History</Link>
            </li>
            <li>
              <Link to="/window">Window</Link>
            </li>
            <li>
              <Link to="/connect">Wifi_connect</Link>
            </li>
          </ul>
        </nav>
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
          <Route path="/connect">
            <Wifi_connect />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
