import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "../../App.css";
import Plot from "react-plotly.js";
var mqtt = require("mqtt");
var options = {
  keepalive: 60,
  protocol: "ws",
  username: "ZARVIS.2.4G",
  password: "qwertyuiop",

  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
};

var start_time = Date();

var count = 50;
var ymax = 50;

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);

const DatavsData = () => {
  var topics = ["Temperature", "Voltage", "Current"];
  var topiclink = ["esp32/temperature2", "esp32/voltage", "esp32/current"];
  const [stop, setStop] = useState(true);
  const [save, setSave] = useState(true);
  const [notex, setNotex] = useState("#");
  const [notey, setNotey] = useState("#");

  // const traces = Array(3)
  //   .fill(0)
  //   .map((_, i) => {
  //     const { index, arr } = randomValues(20, 3);
  //     return {
  //       x: Array(20).fill(i),
  //       y: index,
  //       z: arr,
  //       type: "scatter3d",
  //       mode: "lines",
  //     };
  //   });
  const [traces, setDataGraph] = useState({
    x: startingNumbers,
    y: startingNumbersy,
    z: startingNumbers,
  });
  const [current_time, setCurrent_time] = useState(start_time);
  const [valuex, setValuex] = useState("Select");
  const [valuey, setValuey] = useState("Select");
  const [xunit, setxunit] = useState("");
  const [yunit, setyunit] = useState("");

  const stopHandler = () => {
    setStop(!stop);
  };

  const saveHandler = () => {
    setSave(!save);
  };

  const handleSelectx = (e) => {
    if (valuey !== e) {
      setValuex(e);

      setxunit();
    }
    console.log(e);
  };

  const handleSelecty = (e) => {
    if (valuex !== e) setValuey(e);
    console.log(e);
  };

  const handlexunit = (e) => {
    if (e === "Temperature") setxunit("&deg;C");
    else if (e === "Voltage") setxunit("mV");
    else if (e === "Current") setxunit("mA");
  };

  const handleyunit = (e) => {
    if (e === "Temperature") setyunit("&deg;C");
    else if (e === "Voltage") setyunit("mV");
    else if (e === "Current") setyunit("mA");
  };

  var itemMessagex = "",
    itemMessagey = "";
  useEffect(() => {
    const client = mqtt.connect("mqtt://192.168.1.25:9001", options);
    client.on("connect", () => {
      console.log("connected");
      topiclink.forEach((x, i) => {
        client.subscribe(x);
      });
    });
    client.on("message", function (topic, message) {
      // note = message.toString();

      topics.forEach((x, i) => {
        if (x === valuex) {
          topiclink.forEach((top, j) => {
            if (i === j) {
              if (topic === top) {
                itemMessagex = message.toString();
              }
            }
          });
        }
        if (x === valuey) {
          topiclink.forEach((top, j) => {
            if (i === j) {
              if (topic === top) {
                itemMessagey = message.toString();
              }
            }
          });
        }
      });

      setDataGraph((prev) => {
        return {
          x: stop ? [...prev.x, itemMessagex] : [...prev.x],
          y: stop ? [...prev.y, itemMessagey] : [...prev.y],
          z: stop ? [...prev.z, count++] : [...prev.z],
          mode: "lines+markers",
          type: "scatter3d",
        };
      });

      setNotex(itemMessagex);
      setNotey(itemMessagey);

      if (stop) setCurrent_time(Date());
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="temp">
      <h1 className="title_head">Comparison Dashboard</h1>
      <div className="select">
        <DropdownButton
          title={valuex}
          id="dropdown-menu-align-right"
          onSelect={handleSelectx}
        >
          <Dropdown.Item eventKey="Temperature" onClick={handlexunit}>
            Temperature
          </Dropdown.Item>
          <Dropdown.Item eventKey="Voltage" onClick={handlexunit}>
            Voltage
          </Dropdown.Item>
          <Dropdown.Item eventKey="Current" onClick={handlexunit}>
            Current
          </Dropdown.Item>
        </DropdownButton>
        Vs
        <DropdownButton
          alignRight
          title={valuey}
          id="dropdown-menu-align-right"
          onSelect={handleSelecty}
        >
          <Dropdown.Item eventKey="Temperature" onClick={handleyunit}>
            Temperature
          </Dropdown.Item>
          <Dropdown.Item eventKey="Voltage" onClick={handleyunit}>
            Voltage
          </Dropdown.Item>
          <Dropdown.Item eventKey="Current" onClick={handleyunit}>
            Current
          </Dropdown.Item>
        </DropdownButton>
        <button className="button button-33" onClick={stopHandler}>
          {stop ? "Stop" : "Run"}
        </button>
        <button class="button button-33" onClick={saveHandler}>
          {save ? "Saving..." : "Save"}
        </button>
      </div>

      <p>
        {valuex} is: {notex}
      </p>
      <p>
        {valuey} is: {notey}
      </p>

      <div className="time_heading">
        <h4>Start Time : {start_time}</h4>
        <h4>Current Time : {current_time}</h4>
      </div>
      <div className="plot">
        {valuex === "Select" || valuey === "Select" ? (
          <div className="axischeck">Select both axises</div>
        ) : (
          <Plot
            data={[traces]}
            layout={{
              width: 900,
              height: 800,

              title: `Simple 3D Scatter`,
            }}
          />
        )}
      </div>
      <br />
    </div>
  );
};

export default DatavsData;
