import React, { useState, useEffect } from "react";
import "../../App.css";
import Plot from "react-plotly.js";
import worker_script from "./worker.js";
import { toast } from "react-toastify";
import { FaStop, FaStopCircle } from "react-icons/fa";
// import { type } from "@testing-library/user-event/dist/type";
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
var allEntriest = [];

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);
const myWorker = new Worker(worker_script, { type: "module" });
const Temperature = (props) => {
  const [stop, setStop] = useState(true);
  const [save, setSave] = useState(false);
  const [note, setNote] = useState("#");
  const [ymax, setymax] = useState(50);
  const [ymin, setymin] = useState(-50);

  const [dataGraph, setDataGraph] = useState({
    x: startingNumbers,
    y: startingNumbersy,
    line: { color: "#ff8c00" },
  });
  const [data, setData] = useState({
    x: startingNumbers,
    y: startingNumbersy,
  });
  const [current_time, setCurrent_time] = useState(start_time);

  const stopHandler = () => {
    setStop(!stop);
  };

  const nonBlockingExport = (data) => {
    // clickStart = new Date().getTime();
    getCSV(data);
  };
  const getCSV = (data) => {
    console.log("Formatting csv...");
    workerMaker("csvFormat", data);
  };

  const getBlob = (csvFile) => {
    console.log("creating blob...");
    workerMaker("blobber", csvFile);
  };
  const workerMaker = (type, arg) => {
    // check if a Worker has been defined before calling postMessage with specified arguments
    if (window.Worker) {
      myWorker.postMessage({ type, arg });
    }
  };

  const saveFile = (blob) => {
    const uniqTime = new Date().getTime();
    const filename = `my_file_${uniqTime}`;
    if (navigator.msSaveBlob) {
      // IE 10+
      console.info("Starting call for " + "ie download");
      const ieFilename = `${filename}.csv`;
      navigator.msSaveBlob(blob, ieFilename);
    } else {
      console.info(`Starting call for html5 download`);
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  myWorker.onmessage = function (e) {
    console.log("Message received from worker");
    const response = e.data;
    const data = response.data;
    const type = response.type;
    if (type === "csvFormat") {
      getBlob(data);
    } else if (type === "blobber") {
      saveFile(data);
    } else {
      toast.error(`An Invalid type has been passed in`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    const client = mqtt.connect("mqtt://192.168.1.2:9001", options);
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
      // console.log(itemMessage + "*" + Date.now());
      setDataGraph((prev) => {
        countd++;
        return {
          x: stop ? [...prev.x.slice(1), countd] : [...prev.x],
          y: stop ? [...prev.y.slice(1), itemMessage] : [...prev.y],
          mode: "lines+markers",
          line: { color: "#ff8c00" },
        };
      });

      if (stop) {
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

  // useEffect(() => {
  //   // if (data) {

  //   const interval = setInterval(() => {
  //     // console.log(data.x.length + "ewe" + new Date().getTime());

  //     setDataGraph((prev) => {
  //       return {
  //         x: stop ? [...prev.x.slice(1), ++count] : [...prev.x],
  //         y: stop ? [...prev.y.slice(1), data.y[count]] : [...prev.y],
  //         mode: "lines+markers",
  //       };
  //     });

  //     setData((prev) => {
  //       return {
  //         x: [...prev.x.slice(1)],
  //         y: [...prev.y.slice(1)],
  //         // mode: "lines+markers",
  //       };
  //     });
  //     setNote(data.y[count]);
  //     // if (save) webworker.postMessage(data.y[count]);
  //     // webworker.terminate();
  //   }, 50);

  //   // console.log("ererter");
  //   return () => {
  //     clearInterval(interval);
  //   };
  //   // }
  // }, [data]);

  return (
    <div className="letter">
      <div className="inputtopic">
        <p className="inputtopic">
          <span style={{ marginRight: "10px" }}>
            {stop ? (
              <FaStop style={{ color: "red" }} onClick={stopHandler} />
            ) : (
              <FaStopCircle onClick={stopHandler} />
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
                  onChange={(event) => setymin(event.target.value)}
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
                  onChange={(event) => setymax(event.target.value)}
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
              range: [ymin, ymax],
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
