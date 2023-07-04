import React, { useState, useEffect } from "react";
import "../../App.css";
import Plot from "react-plotly.js";

//for multithreading work is defined in worker.js
import worker_script from "./worker.js";

//declaring mqtt client to subsscribe
var mqtt = require("mqtt");

//options for server specification
var options = {
  keepalive: 60,
  protocol: "ws",
  username: "ZARVIS.2.4G",
  password: "qwertyuiop",

  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
};

//variables for constant changes
var start_time = Date(); // start is every time to refresh that instant first time
var countd = 50; //for default datas
var count = 50;
var ymax = 50;
var allEntriesv = []; //default empty array containg data for csv file download

var startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

var startingNumbersy = Array(ymax)
  .fill(1)
  .map((_, i) => i);

const myWorker = new Worker(worker_script, { type: "module" }); //thread creation for threading

const Voltage = (props) => {
  const [stop, setStop] = useState(true); // state to stop graph of voltage stop true means you can stop ie graph is running
  const [save, setSave] = useState(false); //state to save the datas in csv file and download it
  const [note, setNote] = useState("#"); // data indicator will container # till value is not comming

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

  const nonBlockingExport = (data) => {
    //
    // clickStart = new Date().getTime();
    getCSV(data);
  };
  const getCSV = (data) => {
    console.log("Formatting csv...");
    workerMaker("csvFormat", data);
  };

  const getBlob = (csvFile) => {
    //data is now converted to blob data format
    console.log("creating blob...");
    workerMaker("blobber", csvFile); // posting data to workermaker  for type conversion
  };
  const workerMaker = (type, arg) => {
    // check if a Worker has been defined before calling postMessage with specified arguments
    if (window.Worker) {
      myWorker.postMessage({ type, arg }); // threading is called 1st time for type data then blob type
    }
  };

  const saveFile = (blob) => {
    //when data in blob format is acheived data is saved in file in this method
    const uniqTime = new Date().getTime();
    const filename = `my_file_${uniqTime}`;
    if (navigator.msSaveBlob) {
      // IE 10+
      console.info("Starting call for " + "ie download");
      const ieFilename = `${filename}.csv`;
      navigator.msSaveBlob(blob, ieFilename);
    } else {
      console.info(`Starting call for html5 download`);
      const link = document.createElement("a"); //link creation
      if (link.download !== undefined) {
        //if link is created and download operated
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob); // creating url for blob
        link.setAttribute("href", url); // making link for data
        link.setAttribute("download", filename); //download the data file
        link.style.visibility = "hidden"; // link is made absent
        document.body.appendChild(link); //link is automatically triggered to download the file through link
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  myWorker.onmessage = function (e) {
    //event handler to get message from worker thread
    console.log("Message received from worker");
    const response = e.data;
    const data = response.data;
    const type = response.type;
    if (type === "csvFormat") {
      // conversion of data to blob
      getBlob(data);
    } else if (type === "blobber") {
      // if data is of blob type then start saving
      saveFile(data);
    } else {
      console.error("An Invalid type has been passed in");
    }
  };
  const saveHandler = () => {
    // method to start saving the data for csv
    setSave(!save);
    if (save) {
      var data = sessionStorage.getItem("allEntriesv"); // getting the data stored in sesion in data variable
      nonBlockingExport(data); // method will get csv file
      sessionStorage.clear(); // after download of the csv file data stored in session storage will be deleted
    }
  };

  useEffect(() => {
    const client = mqtt.connect("mqtt://192.168.1.18:9001", options); ////client specifications to connect to server
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
      //on evry session closure client will end
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
    <div className="temp">
      <h1 className="title_head letter">
        Perfomance {props.message} Dashboard
      </h1>

      <button className="button button-33" onClick={stopHandler}>
        {stop ? "Stop" : "Run"}
      </button>

      <p>
        {props.message} is: {note}mV
      </p>

      <div className="plot">
        <Plot
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
              range: [-16000, 16000],
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
