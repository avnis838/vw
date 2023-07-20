import React from "react";
import Tooltip from "@atlaskit/tooltip";
import "../../App.css";
import Current from "./Current.js";
import Temperature from "./Temperature.js";
import Voltage from "./Voltage.js";
import Speed from "./Speed.js";
import worker_script from "../../worker.js";
import { Multiselect } from "multiselect-react-dropdown";
import { FaPlus, FaMinus, FaSave, FaDownload } from "react-icons/fa";

// import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select, { components, SingleValueProps } from "react-select";
// import Button from "@mui/material/Button";

import { Button, Icon } from "semantic-ui-react";

var start_time = Date();

var plotList = [
  { value: "1", label: 1 },
  { value: "2", label: 2 },
  { value: "3", label: 3 },
  { value: "4", label: 4 },
];
var topicList = [{ value: "", label: "" }];

var showAddButton = false;

var addoption = "";

const myWorker = new Worker(worker_script, { type: "module" });

export default function History() {
  const [current_time, setCurrent_time] = useState(start_time);

  const [plot1topic, setplot1topic] = useState("Topic1");
  const [plot2topic, setplot2topic] = useState("Topic2");
  const [plot3topic, setplot3topic] = useState("Topic3");
  const [plot4topic, setplot4topic] = useState("Topic4");
  const [selectedplot, setSelectedplot] = useState();
  const [selectedtopic, setSelectedtopic] = useState();
  const [server1, setServer] = useState("192.168.1.17");
  const [port1, setPort] = useState("9001");
  const [wifi, setWifi] = useState("ZARVIS.2.4G");
  const [password, setPassword] = useState("qwertyuiop");

  function downloadCSV() {
    // Retrieve arrays from sessionStorage
    const array1 = sessionStorage.getItem("allEntriesc");
    const array2 = sessionStorage.getItem("allEntriesv");
    const array3 = sessionStorage.getItem("allEntriest");
    console.log(array1);
    // Create an array of objects representing the rows
    const rows = array1.forEach((item, index) => ({
      column1: item,
      column2: array2[index],
      column3: array3[index],
    }));

    // Convert the array of objects to a CSV string
    const csvContent = rows
      .map((row) => Object.values(row).join(","))
      .join("\n");

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary anchor element for downloading
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "data.csv";

    // Simulate a click on the anchor element to trigger download
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#E2E8F0" : "#EDF2F7",
      borderColor: state.isFocused ? "#63B3ED" : "#CBD5E0",
      boxShadow: state.isFocused ? "0 0 0 2px #A3BFFA" : "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#4299E1"
        : state.isFocused
        ? "#A3BFFA"
        : "#FFFFFF",
      color: state.isSelected ? "#FFFFFF" : "#718096",
    }),
  };

  // Array of all options

  const saveHandler = () => {
    if (
      plot1topic === "Topic1" &&
      plot2topic === "Topic2" &&
      plot3topic === "Topic3"
    ) {
      toast.error(`No topics subscribed`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    var value1, value2, value3;
    var data;
    if (plot1topic !== "Topic1") {
      value1 = sessionStorage.getItem("allEntriesc");
      console.log(value1);
      data = { ...data, column1: value1 };
    }
    if (plot2topic !== "Topic2") {
      value2 = sessionStorage.getItem("allEntriesv");
      data = { ...data, column2: value2 };
    }
    if (plot3topic !== "Topic3") {
      value3 = sessionStorage.getItem("allEntriest");
      data = { ...data, column3: value3 };
    }

    if (value1 === null && value2 === null && value3 === null) {
      toast.warning(`Data is empty`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      return;
    }
    console.log(data);
    nonBlockingExport(data);
    sessionStorage.clear();
  };

  const nonBlockingExport = (data) => {
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
    if (window.Worker) {
      myWorker.postMessage({ type, arg });
    }
  };

  const saveFile = (blob) => {
    const uniqTime = new Date().getTime();
    const filename = `my_file_${uniqTime}`;
    if (navigator.msSaveBlob) {
      // IE 10+
      console.info("Starting call for ie download");
      const ieFilename = `${filename}.csv`;
      navigator.msSaveBlob(blob, ieFilename);
    } else {
      console.info(`Starting call for html5 download`);
      const link = document.createElement("a");
      if (link.download !== undefined) {
        sessionStorage.clear();
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

  const showToastMessage = () => {
    if (selectedplot == null || selectedtopic == null) {
      toast.error(`Both Plot and topic should be selected`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      if (selectedplot.value === "1") setplot1topic(selectedtopic.value);
      else if (selectedplot.value === "2") setplot2topic(selectedtopic.value);
      else if (selectedplot.value === "3") {
        setplot3topic(selectedtopic.value);
      } else if (selectedplot.value === "4") {
        setplot4topic(selectedtopic.value);
      }

      toast.success(
        `Plot ${selectedplot.value} added with ${selectedtopic.value}`,
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    }
  };

  function handleSelectplot(data) {
    if (data.value) setSelectedplot(data);
    else {
      toast.error(`- means novalue,first add option to select `, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }

  function handleSelecttopic(data) {
    console.log(data.value);
    if (data.value) setSelectedtopic(data);
  }

  const handleAddButtonClick = () => {
    topicList.push(addoption);
    showAddButton = false;
    addoption = "";
  };

  const handleInputChange = (inputValue) => {
    if (!inputValue) {
      showAddButton = false;
    }
    if (!topicList.find((option) => option.value.includes(inputValue))) {
      addoption = { value: inputValue, label: inputValue };
      showAddButton = true;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent_time(Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="">
      <div className="subscribe">
        <div className="subscribeparts">
          <h6>Plot no</h6>
          <div className="dropdown-container">
            <Select
              options={plotList}
              placeholder=""
              value={selectedplot}
              onChange={handleSelectplot}
              styles={customStyles}
              isSearchable={true}
              // isMulti
            />
          </div>
        </div>
        <div className="subscribeparts">
          <h6>Add/Subscribe topic</h6>
          <div className="dropdown-container">
            <div>
              {showAddButton && (
                <button className="addtopic add" onClick={handleAddButtonClick}>
                  <FaPlus />
                </button>
              )}
            </div>
            <Select
              className="search"
              options={topicList}
              value={selectedtopic}
              onChange={handleSelecttopic}
              onInputChange={handleInputChange}
              styles={customStyles}
              isSearchable
              placeholder="ex - esp32/temperature"
            />
          </div>
        </div>
        <div className="subscribeparts">
          <Button className="subbtn button-33 " onClick={showToastMessage}>
            Subscribe
          </Button>

          <FaDownload onClick={saveHandler} className="download" />

          <ToastContainer />
        </div>
      </div>

      <div className="letter">
        <h5>Start Time: {start_time}</h5>
        <h5>Current Time: {current_time}</h5>
      </div>

      <div className="plots-area">
        <div className="plots">
          <Current
            message={plot1topic}
            server1={server1}
            port1={port1}
            wifi={wifi}
            password={password}
          />
        </div>

        <div className="plots">
          <Voltage
            message={plot2topic}
            server1={server1}
            port1={port1}
            wifi={wifi}
            password={password}
          />
        </div>
      </div>

      <div className="plots-area">
        <div className="plots">
          <Temperature
            message={plot3topic}
            server1={server1}
            port1={port1}
            wifi={wifi}
            password={password}
          />
        </div>

        <div className="plots">
          <Speed
            message={plot4topic}
            server1={server1}
            port1={port1}
            wifi={wifi}
            password={password}
          />
        </div>
      </div>
      <br />
    </div>
  );
}
