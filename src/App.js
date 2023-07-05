import React, { useContext } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import "./App.css";
// import { Button } from "semantic-ui-react";
// import History from "./components/History/History.js";
// import Window from "./components/Window/Window.js";
// import Wifi_connect from "./components/Wifi_authentication/Wifi_connect.js";
// import { Home } from "./Home";
import Navbar from "../src/components/Navbar/NavBar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Navbar/Footer";

// window.Buffer = window.Buffer || require("buffer").Buffer;
// import Select_topicState from "./context/Select_topic/Select_topicState";
// import select_topicContext from "./context/Select_topic/select_topicContext";
{
  /* The following line can be included in your src/index.js or App.js file */
}
// import "semantic-ui-css/semantic.min.css";

//base file

function App() {
  // const a = useContext(select_topicContext);
  return (
    // <Select_topicState>
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Footer />
      </BrowserRouter>
    </div>
    // </Select_topicState>
  );
}

export default App;
