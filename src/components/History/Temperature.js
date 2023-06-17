import React, { useState, useEffect } from "react";
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
var countd = 50;
var ymax = 50;

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);
const Temperature = () => {
  const [stop, setStop] = useState(true);
  const [save, setSave] = useState(true);
  const [note, setNote] = useState("#");

  const [dataGraph, setDataGraph] = useState({
    x: startingNumbers,
    y: startingNumbersy,
  });
  const [data, setData] = useState({
    x: startingNumbers,
    y: startingNumbersy,
  });
  const [current_time, setCurrent_time] = useState(start_time);

  const stopHandler = () => {
    setStop(!stop);
  };

  const saveHandler = () => {
    setSave(!save);
  };

  useEffect(() => {
    const client = mqtt.connect("mqtt://192.168.1.25:9001", options);
    // console.log(client.connected);
    client.on("connect", () => {
      console.log("connected");
      client.subscribe("esp32/temperature2");
    });

    client.on("message", function (topic, message) {
      // note = message.toString();
      const itemMessage = message.toString();
      // console.log(itemMessage + "*" + Date.now());
      setData((prev) => {
        return {
          x: stop ? [...prev.x, countd++] : [...prev.x],
          y: stop ? [...prev.y, itemMessage] : [...prev.y],
          // mode: "lines+markers",
        };
      });

      if (stop) setCurrent_time(Date());
    });

    return () => {
      client.end();
    };
  }, []);

  useEffect(() => {
    // if (data) {
    const interval = setInterval(() => {
      console.log(data.x.length);
      setDataGraph((prev) => {
        return {
          x: stop ? [...prev.x.slice(1), ++count] : [...prev.x],
          y: stop ? [...prev.y.slice(1), data.y[count]] : [...prev.y],
          mode: "lines+markers",
        };
      });
      setNote(data.y[count]);
    }, 50);

    // console.log("ererter");
    return () => clearInterval(interval);
    // }
  }, [stop, data]);

  return (
    <div className="temp">
      <h1 className="title_head">Perfomance Temeperature2 Dashboard</h1>

      <button className="button button-33" onClick={stopHandler}>
        {stop ? "Stop" : "Run"}
      </button>
      <button class="button button-33" onClick={saveHandler}>
        {save ? "Saving..." : "Save"}
      </button>
      <p>Temperature is: {note}mA</p>
      <div className="time_heading">
        <h4>Start Time : {start_time}</h4>
        <h4>Current Time : {current_time}</h4>
      </div>
      <div className="plot">
        <Plot
          data={[dataGraph]}
          layout={{
            height: "20vh",
            width: "40vh",
            title: "Temperature2 Growth",

            yaxis: { title: "Temperature2 (&deg;C)" },
          }}
        />
      </div>
      <br />
    </div>
  );
};

export default Temperature;
