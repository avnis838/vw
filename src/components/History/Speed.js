import React, { useState, useEffect } from "react";
// import { useWorker, WORKER_STATUS } from "@koale/useworker";
import "../../App.css";
import Plot from "react-plotly.js";
import worker_script from "./worker.js";
import { FaStop, FaStopCircle } from "react-icons/fa";

// import Current from "./Current.js";

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
var allEntriesc = [];
var ymax = 50;

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);
const myWorker = new Worker(worker_script, { type: "module" });
const Speed = (props) => {
  const [stop, setStop] = useState(true);
  const [save, setSave] = useState(false);
  const [note, setNote] = useState("#");
  const [ymax, setymax] = useState(50);
  const [ymin, setymin] = useState(-50);

  const [dataGraph, setDataGraph] = useState({
    x: startingNumbers,
    y: startingNumbersy,
    line: { color: "#ff66ff" },
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
      var data = sessionStorage.getItem("allEntriesc");
      nonBlockingExport(data);
      sessionStorage.clear();
    }
  };

  function getChecked() {
    const checkBox1 = document.getElementById("typeNumber1").value;
    const checkBox2 = document.getElementById("typeNumber1").value;
  }

  useEffect(() => {
    const client = mqtt.connect("mqtt://192.168.1.2:9001", options);
    client.on("connect", () => {
      console.log("connected");
      console.log(`${props.message}`);
      client.subscribe(`${props.message}`);
      // client.subscribe("mqtt/topic1");
    });
    client.on("message", function (topic, message) {
      // note = message.toString();
      const itemMessage = message.toString();

      // console.log(dataGraph.x.length);
      if (stop) {
        setDataGraph((prev) => {
          countd++;
          // Specify the maximum range of values on the y-axis

          return {
            x: stop ? [...prev.x.slice(1), countd] : [...prev.x],
            y: stop ? [...prev.y.slice(1), itemMessage] : [...prev.y],
            mode: "lines+markers",
            line: { color: "#17BECF" },
            area: { color: "#17BECF" },
          };
        });
        setNote(itemMessage);
        allEntriesc.push(itemMessage);
        // allEntriesc.push(Date.now());
        sessionStorage.setItem("allEntriesc", allEntriesc);
      } else {
        allEntriesc.push("-");
      }

      if (stop) setCurrent_time(Date());
    });
    return () => {
      client.end();
    };
  }, [stop, props]);

  // useEffect(() => {
  //   // if (data) {
  //   const interval = setInterval(() => {
  //     // console.log(data.x.length);
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
  //   }, 50);

  //   // console.log("ererter");
  //   return () => clearInterval(interval);
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
            paper_bgcolor: "#1e2024",
            plot_bgcolor: "#1e2024",
            title: `${props.message} Growth`,

            yaxis: {
              title: `${props.message} (mA)`,

              range: [ymin, ymax],
              type: "area",
            },

            // xaxis: {
            //   autorange: true,
            //   range: [countd - 50, countd],
            //   rangeselector: {
            //     buttons: [
            //       {
            //         count: 1,
            //         label: "10",
            //         step: 10,
            //         stepmode: "backward",
            //       },
            //       {
            //         count: 6,
            //         label: "50",
            //         step: 50,
            //         stepmode: "backward",
            //       },
            //       { step: countd },
            //     ],
            //   },
            //   rangeslider: { range: [0, countd] },
            //   type: "linear",
            // },
          }}
        />
      </div>
      <br />
    </div>
  );
};

export default Speed;
