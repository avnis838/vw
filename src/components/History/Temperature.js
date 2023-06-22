import React, { useState, useEffect } from "react";
import "../../App.css";
import Plot from "react-plotly.js";
import worker_script from "./worker.js";
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
var allEntries = [,];

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);
const Temperature = () => {
  const [stop, setStop] = useState(true);
  const [save, setSave] = useState(false);
  const [note, setNote] = useState("#");
  const myWorker = new Worker(worker_script, { type: "module" });

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
      console.error("An Invalid type has been passed in");
    }
  };
  const saveHandler = () => {
    setSave(!save);
    if (save) {
      var data = sessionStorage.getItem("allEntries");
      nonBlockingExport(data);
      sessionStorage.clear();
    }
  };

  useEffect(() => {
    const client = mqtt.connect("mqtt://192.168.1.19:9001", options);
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

      allEntries.push(itemMessage + "\n");
      sessionStorage.setItem("allEntries", allEntries);

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
      // if (save) webworker.postMessage(data.y[count]);
      setNote(data.y[count]);
      // webworker.terminate();
    }, 50);

    // console.log("ererter");
    return () => {
      clearInterval(interval);
    };
    // }
  }, [data]);

  return (
    <div className="temp">
      <h1 className="title_head">Perfomance Temeperature2 Dashboard</h1>

      <button className="button button-33" onClick={stopHandler}>
        {stop ? "Stop" : "Run"}
      </button>
      <button class="button button-33" onClick={saveHandler}>
        {save ? "Saving..." : "Save"}
      </button>
      <p>Temperature is: {note}degree C</p>
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
