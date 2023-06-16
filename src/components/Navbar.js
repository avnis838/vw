import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div>
      <li>
        <Link to="/">History</Link>
      </li>
      <li>
        <Link to="/cats">Window</Link>
      </li>
      <li>
        <Link to="/sheeps">Wifi_Connect</Link>
      </li>
    </div>
  );
};
export default Navbar;
