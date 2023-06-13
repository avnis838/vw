import React, { useState, useEffect } from "react";
import "../../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
// import Current from "./Current.js";
import Temperature2 from "./Temperature.js";
import Voltage from "./Voltage.js";
import DatavsData from "./DatavsData.js";
import Plot from "react-plotly.js";
// import { Button } from "semantic-ui-react";

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

export default function History() {
  var topics = ["Temperature", "Voltage", "Current"];
  var topiclink = ["esp32/temperature2", "esp32/voltage", "esp32/current"];
  const [stopc, setStopc] = useState(true);
  const [stopv, setStopv] = useState(true);
  const [stopt, setStopt] = useState(true);
  const [stopd, setStopd] = useState(true);

  const [savec, setSavec] = useState(true);
  const [savev, setSavev] = useState(true);
  const [savet, setSavet] = useState(true);
  const [saved, setSaved] = useState(true);

  const [notec, setNotec] = useState("#");
  const [notev, setNotev] = useState("#");
  const [notet, setNotet] = useState("#");
  const [notex, setNotex] = useState("#");
  const [notey, setNotey] = useState("#");

  const [dataGraphc, setDataGraphc] = useState({
    x: startingNumbers,
    y: startingNumbersy,
  });
  const [dataGraphv, setDataGraphv] = useState({
    x: startingNumbers,
    y: startingNumbersy,
  });
  const [dataGrapht, setDataGrapht] = useState({
    x: startingNumbers,
    y: startingNumbersy,
  });

  const [traces, setDataGraph] = useState({
    x: startingNumbers,
    y: startingNumbersy,
    z: startingNumbers,
  });

  const [current_timec, setCurrent_timec] = useState(start_time);
  const [current_timev, setCurrent_timev] = useState(start_time);
  const [current_timet, setCurrent_timet] = useState(start_time);
  const [current_timed, setCurrent_timed] = useState(start_time);
  const [valuex, setValuex] = useState("Select");
  const [valuey, setValuey] = useState("Select");
  const [xunit, setxunit] = useState("");
  const [yunit, setyunit] = useState("");

  const stopHandlerc = () => {
    setStopc(!stopc);
  };

  const stopHandlerv = () => {
    setStopv(!stopv);
  };
  const stopHandlert = () => {
    setStopv(!stopv);
  };
  const stopHandlerd = () => {
    setStopv(!stopd);
  };

  const saveHandlerc = () => {
    setSavec(!savec);
  };
  const saveHandlerv = () => {
    setSavev(!savev);
  };

  const saveHandlert = () => {
    setSavev(!savev);
  };
  const saveHandlerd = () => {
    setSavev(!saved);
  };

  const handleSelectx = (e) => {
    if (valuey !== e) {
      setValuex(e);
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

  const client = mqtt.connect("mqtt://192.168.1.22:9001", options);
  client.on("connect", () => {
    console.log("connected");
    topiclink.forEach((x, i) => {
      client.subscribe(x);
    });
  });
  useEffect(() => {
    client.on("message", function (topic, message) {
      var itemMessagex = "#",
        itemMessagey = "#";
      count++;
      // note = message.toString();
      console.log(topic);
      if (topic === topiclink[0]) {
        const itemMessaget = message.toString();
        setDataGrapht((prev) => {
          return {
            x: stopt ? [...prev.x.slice(1), count] : [...prev.x],
            y: stopt ? [...prev.y.slice(1), itemMessaget] : [...prev.y],
          };
        });
        setNotet(itemMessaget);
        if (stopt) setCurrent_timet(Date());
      }
      if (topic === topiclink[1]) {
        const itemMessagev = message.toString();
        setDataGraphv((prev) => {
          return {
            x: stopv ? [...prev.x.slice(1), count] : [...prev.x],
            y: stopv ? [...prev.y.slice(1), itemMessagev] : [...prev.y],
          };
        });
        setNotev(itemMessagev);
        if (stopv) setCurrent_timev(Date());
      }
      if (topic === topiclink[2]) {
        const itemMessagec = message.toString();
        setDataGraphc((prev) => {
          return {
            x: stopc ? [...prev.x.slice(1), count] : [...prev.x],
            y: stopc ? [...prev.y.slice(1), itemMessagec] : [...prev.y],
          };
        });
        setNotec(itemMessagec);
        if (stopc) setCurrent_timec(Date());
      }

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
          x: stopd ? [...prev.x, itemMessagex] : [...prev.x],
          y: stopd ? [...prev.y, itemMessagey] : [...prev.y],
          z: stopd ? [...prev.z, count] : [...prev.z],
          mode: "markers",
          type: "scatter3d",
        };
      });

      setNotex(itemMessagex);
      setNotey(itemMessagey);

      if (stopd) setCurrent_timed(Date());
    });
  }, [
    valuey,
    valuex,
    topics,
    topiclink,
    notec.notev,
    notet,
    stopc,
    stopt,
    stopv,
    stopd,
    client,
  ]);
  return (
    <div className="temp">
      <div className="plot">
        <div>
          <h1 className="title_head">Perfomance Current Dashboard</h1>

          <button className="button button-33" onClick={stopHandlerc}>
            {stopc ? "Stop" : "Run"}
          </button>
          <button class="button button-33" onClick={saveHandlerc}>
            {savec ? "Saving..." : "Save"}
          </button>
          <p>Current is: {notec}mA</p>
          <div className="time_heading">
            <h4>Start Time : {start_time}</h4>
            <h4>Current Time : {current_timec}</h4>
          </div>
          <div className="plot">
            <Plot
              data={[dataGraphc]}
              layout={{
                height: "20vh",
                width: "40vh",
                title: "Current Growth",

                yaxis: { title: "Current (mA)" },
              }}
            />
          </div>
        </div>
        <div>
          <h1 className="title_head">Perfomance Voltage Dashboard</h1>

          <button className="button button-33" onClick={stopHandlerv}>
            {stopv ? "Stop" : "Run"}
          </button>
          <button class="button button-33" onClick={saveHandlerv}>
            {savev ? "Saving..." : "Save"}
          </button>
          <p>Voltage is: {notev}mV</p>
          <div className="time_heading">
            <h4>Start Time : {start_time}</h4>
            <h4>Current Time : {current_timev}</h4>
          </div>
          <div className="plot">
            <Plot
              data={[dataGraphv]}
              layout={{
                height: "20vh",
                width: "40vh",
                title: "Voltage Growth",

                yaxis: { title: "Voltage (mV)" },
              }}
            />
          </div>
        </div>
        {/* <Current />
        <Voltage /> */}
      </div>
      <div className="plot">
        <div>
          <h1 className="title_head">Perfomance Temperature Dashboard</h1>

          <button className="button button-33" onClick={stopHandlert}>
            {stopc ? "Stop" : "Run"}
          </button>
          <button class="button button-33" onClick={saveHandlert}>
            {savec ? "Saving..." : "Save"}
          </button>
          <p>Temperature is: {notet} degree C</p>
          <div className="time_heading">
            <h4>Start Time : {start_time}</h4>
            <h4>Current Time : {current_timet}</h4>
          </div>
          <div className="plot">
            <Plot
              data={[dataGrapht]}
              layout={{
                height: "20vh",
                width: "40vh",
                title: "Temperature Growth",

                yaxis: { title: "Temperature (&deg;C)" },
              }}
            />
          </div>
        </div>
        {/* <Temperature2 /> */}
        {/* <DatavsData /> */}
        <div>
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
            <button className="button button-33" onClick={stopHandlerd}>
              {stopd ? "Stop" : "Run"}
            </button>
            <button class="button button-33" onClick={saveHandlerd}>
              {saved ? "Saving..." : "Save"}
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
            <h4>Current Time : {current_timed}</h4>
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
        </div>
      </div>

      <br />
    </div>
  );
}
