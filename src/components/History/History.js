import React, { useState, Fragment, useEffect } from "react";
import "../../App.css";
import Plot from "react-plotly.js";
import { Button } from "semantic-ui-react";

var mqtt = require("mqtt");
var options = {
  keepalive: 60,
  protocol: "ws",
  username: "ZARVIS.2.4G",
  password: "qwertyuiop",
  // clientId uniquely identifies client
  // choose any string you wish

  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
};

var start_time = Date();
var client = mqtt.connect("mqtt://192.168.43.81:9001", options);

client.subscribe("esp32/temperature");
console.log(client);
console.log("Client subscribed ");

var count = 50;
var ymax = 50;

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);

export default function History() {
  // var note;
  const [stop, setStop] = useState(true);
  const [save, setSave] = useState(true);
  const [note, setNote] = useState("#");
  var [data, setData] = React.useState({
    x: startingNumbers,
    y: startingNumbersy,
  });

  // Sets default React state
  var [msg, setMsg] = useState(
    <Fragment>
      <em>...</em>
    </Fragment>
  );

  var [current_time, setCurrent_time] = useState(start_time);

  client.on("message", function (topic, message) {
    // note = message.toString();
    setNote(message.toString());
    // ymax = ymax < message ? message : ymax;
    // count =
    // Updates React state with message
    // setMsg(note, 1000);
    // console.log(note);
  });

  const stopHandler = () => {
    setStop(!stop);
  };

  const saveHandler = () => {
    setSave(!save);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // if (stop) setMsg(note);
      setData((prev) => {
        return {
          //   x: prev.x,
          // x: stop ? [...prev.x, new Date().toLocaleTimeString()] : [...prev.x],
          // y: [...prev.y, note],
          x: stop ? [...prev.x.slice(1), (count += 1)] : [...prev.x],
          y: stop ? [...prev.y.slice(1), note] : [...prev.y],
        };
      });
      if (stop) setCurrent_time(Date());
    }, 0.008681);

    return () => {
      clearInterval(interval);
    };
  }, [note, stop]);
  return (
    <div className="temp">
      <h1>Perfomance History Dashboard</h1>
      <button className="button button-33" onClick={stopHandler}>
        {stop ? "Stop" : "Run"}
      </button>

      <button class="button button-33" onClick={saveHandler}>
        {save ? "Saving..." : "Save"}
      </button>

      <p>Temperature is: {note}&deg;C</p>
      <div className="time_heading">
        <h4 className="">Start Time : {start_time}</h4>
        <h4>Current Time : {current_time}</h4>
      </div>

      <div className="plot">
        <Plot
          data={[data]}
          layout={{
            height: "30vh",
            width: "50vh",
            title: "Temperature Growth",

            yaxis: { title: "Temperature (&deg;C)" },
          }}
        />
      </div>
      <br />
    </div>
  );
}
