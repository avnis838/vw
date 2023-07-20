import React, { useState, useEffect } from "react";
import "../../App.css";
import Plot from "react-plotly.js";

import { FaForward, FaStop } from "react-icons/fa";
import { MaxPriorityQueue } from "@datastructures-js/priority-queue";

var mqtt = require("mqtt");
var options = {
  keepalive: 60,
  protocol: "ws",
  username: "No Ddata",
  password: "9135453595",

  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
};

var start_time = Date();

var count = 50;
var countd = 50;
var ymax = 50;
var allEntriest = [];

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);

const Temperature = (props) => {
  const [stop, setStop] = useState(true);
  const [note, setNote] = useState("#");
  const [ymax, setymax] = useState(50);
  const [ymin, setymin] = useState(-50);

  const [dataGraph, setDataGraph] = useState({
    x: startingNumbers,
    y: startingNumbersy,
    line: { color: "#ff8c00" },
  });

  const [current_time, setCurrent_time] = useState(start_time);

  const stopHandler = () => {
    setStop(!stop);
  };

  useEffect(() => {
    const client = mqtt.connect(`mqtt://${props.server1}:${props.port1}`, {
      keepalive: 60,
      protocol: "ws",
      username: `${props.username}`,
      password: `${props.password}`,

      clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
    });
    // console.log(client.connected);
    client.on("connect", () => {
      console.log("connected");
      // console.log(`${props.message}`);
      client.subscribe(`${props.message}`);
      // client.subscribe("esp32/temperature");
    });

    client.on("message", function (topic, message) {
      // note = message.toString();
      const itemMessage = message.toString();

      const mpq = MaxPriorityQueue.fromArray(dataGraph.y);
      setymax(mpq.front());
      // console.log(itemMessage + "*" + Date.now());

      if (stop) {
        setDataGraph((prev) => {
          countd++;
          return {
            x: stop ? [...prev.x.slice(1), countd] : [...prev.x],
            y: stop ? [...prev.y.slice(1), itemMessage] : [...prev.y],
            mode: "lines+markers",
            line: { color: "#ff8c00" },
          };
        });

        setNote(itemMessage);
        allEntriest.push(itemMessage);
        // allEntriest.push(Date.now());
        sessionStorage.setItem("allEntriest", allEntriest);
      } else {
        allEntriest.push("-");
      }
    });

    return () => {
      client.end();
    };
  }, [stop, props]);

  return (
    <div className="letter">
      <div className="inputtopic">
        <p className="inputtopic">
          <span style={{ marginRight: "10px" }}>
            {stop ? (
              <FaStop style={{ color: "red" }} onClick={stopHandler} />
            ) : (
              <FaForward onClick={stopHandler} />
            )}
          </span>
          {props.message} is:{" "}
          <span
            style={{
              fontWeight: "bold",
              color: "whitesmoke",
            }}
          >
            <div style={{ width: "100px" }}> {note}mA</div>
          </span>{" "}
          <div className="inputtopic" style={{ margin: "2px" }}>
            <br />
            <div className="inputtopic" style={{ margin: "2px" }}>
              <label
                className="form-label"
                htmlFor="typeNumber2"
                style={{ margin: "2px" }}
              >
                Y-Min
              </label>
              <div
                className="form-outline"
                style={{ width: "5rem", height: "1.5rem" }}
              >
                <input
                  onChange={(event) => {
                    stop == 0 && setymin(event.target.value);
                  }}
                  step="0.01"
                  defaultValue="-50"
                  type="number"
                  id="typeNumber2"
                  className="form-control"
                />
              </div>
            </div>
            <div className="inputtopic" style={{ margin: "10px" }}>
              <label
                className="form-label"
                htmlFor="typeNumber1"
                style={{ margin: "2px" }}
              >
                Y-Max
              </label>
              <div
                className="form-outline"
                style={{ width: "5rem", height: "1.5rem" }}
              >
                <input
                  onChange={(event) => {
                    stop == 0 && setymax(event.target.value);
                  }}
                  step="0.01"
                  defaultValue="50"
                  type="number"
                  id="typeNumber1"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </p>
      </div>

      <div className="plot">
        <Plot
          data={[dataGraph]}
          layout={{
            mode: "lines+markers",
            autosize: false,
            width: 500,
            height: 400,

            margin: {
              l: 50,
              r: 50,
              b: 50,
              t: 50,
              pad: 4,
            },
            // font: "#ffffff",
            paper_bgcolor: "#1e2024",
            plot_bgcolor: "#1e2024",
            title: `${props.message} Growth`,
            yaxis: {
              title: `${props.message} (&deg;C)`,
              range: [stop ? -1 * ymax - 1 : ymin, stop ? ymax + 1 : ymax],
              type: "linear",
            },
          }}
        />
      </div>
      <br />
    </div>
  );
};

export default Temperature;
