import React, { useContext } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import withSplashScreen from "./components/withSplashScreen";
import "./App.css";
import Navbar from "../src/components/Navbar/NavBar.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Navbar/Footer";

//base file from here aal the will be rturned to index.html

function App() {
  return (
    <div className="App">
      {/* browserRouter to enable routing with links */}
      <BrowserRouter>
        {/* navbar-component */}
        <Navbar />
        {/* footer-component */}
        <Footer />
      </BrowserRouter>
    </div>
    // </Select_topicState>
  );
}

export default withSplashScreen(App);
