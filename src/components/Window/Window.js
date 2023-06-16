import React, { useState, Fragment, useEffect } from "react";
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
var client = mqtt.connect("mqtt://192.168.1.25:9001", options);

client.subscribe("esp32/temperature");
console.log(client);
console.log("Client subscribed ");

var count = 30;
var ymax = 30;

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);

export default function Window() {
  var note;
  let prevTimestamp = null,
    messageGap = null;
  client.on("message", function (topic, message) {
    note = message.toString();

    const currentTimestamp = Date.now();
    // messageGap = prevTimestamp ? currentTimestamp - prevTimestamp : null;
    prevTimestamp = currentTimestamp;
    // console.log(note);
  });

  const [stop, setStop] = useState(true);
  const [items, setItems] = useState([[]]);

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

  const stopHandler = () => {
    // if (stop) {
    //   console.log(items);
    // }
    setStop(!stop);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (stop) setMsg(note);
      setData((prev) => {
        return {
          x: stop ? [...prev.x.slice(1), (count += 1)] : [...prev.x],
          y: stop ? [...prev.y.slice(1), note] : [...prev.y],
          // xaxis: { range: count < 50 ? [0, count] : [count - 50, count] },
          // yaxis: { range: [0, note] },
        };
      });
      if (stop) setCurrent_time(Date());
      // localStorage.setItem("items", JSON.stringify([note, count]));
      // console.log(messageGap);
    }, 0.008);

    return () => {
      clearInterval(interval);
    };
  }, [note, stop, items]);
  return (
    <div className="temp">
      <h1>Perfomance Window Dashboard</h1>
      <button className="button button-33" onClick={stopHandler}>
        {stop ? "Stop" : "Run"}
      </button>
      <p>Temperature is: {msg}&deg;C</p>
      {/* <AccelDial id="dial3" value={msg} title="Acceleration X" /> */}
      {/* <Temp id="dial7" value={msg} title="Lowest Temp" /> */}
      <div className="time_heading">
        <h4 className="">Start Time : {start_time}</h4>
        <h4>Current Time : {current_time}</h4>
      </div>
      <Plot
        options={{}}
        data={[data]}
        layout={{
          title: "Temperature Growth",

          yaxis: { title: "Temperature (&deg;C)" },
        }}
      />

      <br />
    </div>
  );
}
