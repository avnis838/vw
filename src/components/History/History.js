import React, { useState, Fragment, useEffect } from "react";
import "../../App.css";
import Plot from "react-plotly.js";
// import { Button } from "semantic-ui-react";

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

// console.log(client);
// console.log("Client subscribed ");

var count = 100;
var ymax = 100;

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
  const [data, setData] = useState([]);
  const [dataGraph, setDataGraph] = useState({
    x: startingNumbers,
    y: startingNumbersy,
  });
  const [current_time, setCurrent_time] = useState(start_time);

  // console.log("data : ", data.length, data);

  // Sets default React state
  // var [msg, setMsg] = useState(
  //   <Fragment>
  //     <em>...</em>
  //   </Fragment>
  // );

  const stopHandler = () => {
    setStop(!stop);
  };

  const saveHandler = () => {
    setSave(!save);
  };

  const client = mqtt.connect("mqtt://192.168.1.19:9001", options);
  client.on("connect", () => {
    console.log("connected");
    client.subscribe("esp32/temperature");
  });
  useEffect(() => {
    client.on("message", function (topic, message) {
      // note = message.toString();
      const itemMessage = message.toString();
      console.log("itemMessage: ", itemMessage);
      console.log(count);

      setData((currentData) => {
        // Create an array with a new reference.
        // Without a new reference react assumes there is no change to the array.
        let array = [...currentData];

        if (currentData.length < 50) {
          array.push(itemMessage);
        } else {
          array = [...currentData.slice(1), itemMessage];
        }

        return array;
      });

      setDataGraph((prev) => {
        return {
          x: stop ? [...prev.x.slice(1), count++] : [...prev.x],
          y: stop ? [...prev.y.slice(1), itemMessage] : [...prev.y],
          // xaxis: { range: count < 50 ? [0, count] : [count - 50, count] },
          // yaxis: { range: [0, note] },
        };
      });

      setNote(itemMessage);
      // ymax = ymax < message ? message : ymax;
      // count =
      // Updates React state with message
      // setMsg(note, 1000);
      // console.log(note);
    });
    // const interval = setInterval(() => {
    //   // if (stop) setMsg(note);
    //
    //   if (stop) setCurrent_time(Date());
    //   // console.log(current_time - prev_time);
    //   // if (stop) setPrev_time(current_time);
    // }, 0.008);

    // return () => {
    //   clearInterval(interval);
    // };
    // return () => {
    //   client.end();
    // };
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
        <h4>Start Time : {start_time}</h4>
        <h4>Current Time : {current_time}</h4>
      </div>
      <div className="plot">
        <Plot
          data={[dataGraph]}
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
