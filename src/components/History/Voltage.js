import React, { useState, useEffect } from "react";
import "../../App.css";
import Plot from "react-plotly.js";
import { FaForward, FaStop } from "react-icons/fa";
import { MaxPriorityQueue } from "@datastructures-js/priority-queue";

//declaring mqtt client to subsscribe
var mqtt = require("mqtt");

//options for server specification
var options = {
  keepalive: 60,
  protocol: "ws",
  username: "No Ddata",
  password: "9135453595",

  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
};

//variables for constant changes
var start_time = Date(); // start is every time to refresh that instant first time
var countd = 50; //for default datas
var count = 50;
var ymax = 50;
var width = 0.5;
var width1 = 0.5;
var allEntriesv = []; //default empty array containg data for csv file download

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);

const Voltage = (props) => {
  const [stop, setStop] = useState(true); // state to stop graph of voltage stop true means you can stop ie graph is running

  const [note, setNote] = useState("#"); // data indicator will container # till value is not comming
  const [ymax, setymax] = useState(50);
  const [ymin, setymin] = useState(-50);

  const [dataGraph, setDataGraph] = useState({
    // initialisation of dataGraph that will be shown in the graph
    x: startingNumbers,
    y: startingNumbersy,
  });

  // const [data, setData] = useState({
  //   x: startingNumbers,
  //   y: startingNumbersy,
  // });
  const [current_time, setCurrent_time] = useState(start_time); // showing running time

  const stopHandler = () => {
    // method to stop the graph set setting the value of tht stop
    setStop(!stop);
  };

  useEffect(() => {
    const client = mqtt.connect(`mqtt://${props.server1}:${props.port1}`, {
      keepalive: 60,
      protocol: "ws",
      username: `${props.username}`,
      password: `${props.password}`,

      clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
    }); ////client specifications to connect to server
    client.on("connect", () => {
      //connect done once when voltage compnent is refreshed
      console.log("connected");
      // client.subscribe("esp32/voltage"); // client will subscribe to the topic voltage
      // client.subscribe("mqtt/topic2"); // client will subscribe to the topic voltage
      // console.log(`${props.message}`);
      client.subscribe(`${props.message}`);
    });
    client.on("message", function (topic, message) {
      //an event listener function to be called when data of particular topic is received
      // note = message.toString();
      const itemMessage = message.toString();
      const mpq = MaxPriorityQueue.fromArray(dataGraph.y);
      setymax(mpq.front());

      if (stop) {
        setDataGraph((prev) => {
          countd++;
          //datagraph queue will be updated with one value and oldest will be deleted
          return {
            x: stop ? [...prev.x.slice(1), countd] : [...prev.x],
            y: stop ? [...prev.y.slice(1), itemMessage] : [...prev.y],
            mode: "lines+markers",
          };
        });
        setNote(itemMessage);
        allEntriesv.push(itemMessage);
        // allEntriesv.push(Date.now());
        sessionStorage.setItem("allEntriesv", allEntriesv);
      } else {
        allEntriesv.push("-");
      }

      if (stop) setCurrent_time(Date());
    });
    return () => {
      client.on("connect", () => {
        client.unsubscribe(`${props.message}`);
      });
      //on evry session closure client will end
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
          useResizeHandler
          data={[dataGraph]}
          layout={{
            mode: "lines+markers",
            autosize: true,
            width: 500,
            height: 400,

            margin: {
              l: 50,
              r: 50,
              b: 50,
              t: 50,
              pad: 4,
            },
            paper_bgcolor: "#1e2024",
            plot_bgcolor: "#1e2024",
            title: `${props.message} Growth`,

            yaxis: {
              title: `${props.message} (mV)`,
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

export default Voltage;
