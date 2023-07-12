import React from "react";
import Tooltip from "@atlaskit/tooltip";
import "../../App.css";
import Current from "./Current.js";
import Temperature from "./Temperature.js";
import Voltage from "./Voltage.js";
import Speed from "./Speed.js";
import worker_script from "./worker.js";
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

// const Input = ({ children, ...props }: SingleValueProps<>) => {
//   const [tooltipContent, setTooltipContent] = useState("");

//   const handleInputChange = (event) => {
//     const inputValue = event.target.value;
//     console.log(inputValue);
//     setTooltipContent(tooltipContent + inputValue);
//   };
//   const updatetopicList = () => {
//     topicList.push({ value: `${tooltipContent}`, label: `${tooltipContent}` });
//   };
//   if (props.isHidden) {
//     return <components.Input {...props} />;
//   }
//   return (
//     <div className="inputtopic">
//       <Tooltip content={"Custom Input"}>
//         {/* {tooltipContent} */}
//         <components.Input {...props} onChange={handleInputChange} />
//       </Tooltip>
//       <button onClick={updatetopicList} className="addtopic">
//         <FaPlus />
//       </button>
//     </div>
//   );
// };

// var plot1topic = "default";
// var plot2topic = "default";
const AddNewOption = (props) => {
  const { children, ...rest } = props;

  const handleClick = (data) => {
    if (data) {
      const inputValue = data;
      const newValue = { value: inputValue, label: inputValue };
      topicList.rem(newValue);
    }
  };

  return (
    <components.Option {...rest}>
      {children}
      <span
        style={{
          marginLeft: "auto",
          marginRight: "10px",
          cursor: "pointer",
          position: "Right",
        }}
        onClick={handleClick}
      ></span>
    </components.Option>
  );
};
// var plot3topic = "default";

export default function History() {
  const [current_time, setCurrent_time] = useState(start_time);
  const [save, setSave] = useState(false);
  const [plot1topic, setplot1topic] = useState("Topic1");
  const [plot2topic, setplot2topic] = useState("Topic2");
  const [plot3topic, setplot3topic] = useState("Topic3");
  const [plot4topic, setplot4topic] = useState("Topic4");
  const [selectedplot, setSelectedplot] = useState();
  const [selectedtopic, setSelectedtopic] = useState();
  const [openDialog, handleDisplay] = React.useState(false);

  const handleClose = () => {
    handleDisplay(false);
  };

  const openDialogBox = () => {
    handleDisplay(true);
  };
  const buttonStyle = {
    width: "10rem",
    fontsize: "1.5rem",
    height: "2rem",
    padding: "5px",
    borderRadius: "10px",
    backgroundColor: "green",
    color: "White",
    border: "2px solid yellow",
  };
  const divStyle = {
    display: "flex",
    felxDirection: "row",
    position: "absolute",
    right: "0px",
    bottom: "0px",
    // padding: "1rem",
  };
  const confirmButtonStyle = {
    width: "5rem",
    height: "1.5rem",
    fontsize: "1rem",
    backgroundColor: "grey",
    color: "black",
    margin: "5px",
    borderRadius: "10px",
    border: "1px solid black",
  };

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
    var value1 = sessionStorage.getItem("allEntriest");
    var value2 = sessionStorage.getItem("allEntriesc");
    var value3 = sessionStorage.getItem("allEntriesv");
    const data = {
      column1: value1,
      column2: value2,
      column3: value3,
    };
    // console.log(data);
    nonBlockingExport(data);
    sessionStorage.clear();
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

  const showToastMessage = () => {
    if (selectedplot == null || selectedtopic == null) {
      toast.error(`Both Plot and topic should be selected`, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    } else {
      if (selectedplot.value == "1") setplot1topic(selectedtopic.value);
      else if (selectedplot.value == "2") setplot2topic(selectedtopic.value);
      else if (selectedplot.value == "3") {
        setplot3topic(selectedtopic.value);
        // console.log(plot3topic + "*");
      } else if (selectedplot.value == "4") {
        setplot4topic(selectedtopic.value);
        // console.log(plot3topic + "*");
      }
      // console.log(plot3topic + " " + selectedtopic.value);
      toast.success(
        `Plot ${selectedplot.value} added with ${selectedtopic.value}`,
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
    }
  };

  // useEffect(() => {}, [plot1topic, plot2topic, plot3topic]);

  function handleSelectplot(data) {
    // console.log(data.value);
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

  // const handleMenuClose = () => {
  //   if (
  //     selectedtopic &&
  //     !topicList.find((option) => option.value === selectedtopic.value)
  //   ) {
  //     topicList.push(selectedtopic);
  //   }
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent_time(Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // console.log(compnentmap.get("3"));

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
              // onMenuClose={handleMenuClose}
              styles={customStyles}
              // isClearable

              isSearchable
              components={{ Option: AddNewOption }}
              placeholder="ex - esp32/temperature"
              // closeMenuOnSelect={false}
              // onCreateOption={handleCreateOption}
            />
          </div>
        </div>
        <div className="subscribeparts">
          <Button
            // class="button"
            className="subbtn button-33 "
            // variant="contained"
            // color="success"
            onClick={showToastMessage}
          >
            Subscribe
          </Button>

          <FaDownload onClick={saveHandler} />

          <ToastContainer />
        </div>
      </div>

      <div className="letter">
        <h5>
          Start Time:{" "}
          {start_time.toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </h5>
        <h5>
          Current Time:{" "}
          {current_time.toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </h5>
      </div>

      <div>
        {/* Button trigger modal */}
        {/* <button
          class="button button-33"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="exampleModal"
        >
          Launch demo modal
        </button> */}
        {/* Modal */}
        <div
          style={{ backgroundColor: "blanchedalmond" }}
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Modal title
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">...</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="plots-area">
        <div className="plots">
          <Current message={plot1topic} />
        </div>

        <div className="plots">
          <Voltage message={plot2topic} />
        </div>
      </div>

      <div className="plots-area">
        <div className="plots">
          <Temperature message={plot3topic} />
        </div>

        <div className="plots">
          <Speed message={plot4topic} />
        </div>
      </div>
      <br />
    </div>
  );
}

// import React, { useState, useEffect } from "react";
// import "../../App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import Dropdown from "react-bootstrap/Dropdown";
// import Current from "./Current.js";
// import Temperature2 from "./Temperature.js";
// import Voltage from "./Voltage.js";
// import DatavsData from "./DatavsData.js";
// import Plot from "react-plotly.js";
// // import { Button } from "semantic-ui-react";

// var mqtt = require("mqtt");
// var options = {
//   keepalive: 60,
//   protocol: "ws",
//   username: "ZARVIS.2.4G",
//   password: "qwertyuiop",

//   clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
// };

// var start_time = Date();

// var count = 50;
// var count2 = 50,
//   count3 = 50;
// var ymax = 50;
// var f1 = false,
//   f2 = false,
//   f3 = false;

// var startingNumbers = Array(count)
//   .fill(1)
//   .map((_, i) => i);

// var startingNumbersy = Array(ymax)
//   .fill(1)
//   .map((_, i) => i);

// const History = () => {
//   var topics = ["Temperature", "Voltage", "Current"];
//   var topiclink = ["esp32/temperature2", "esp32/voltage", "esp32/current"];
//   const [stopc, setStopc] = useState(true);
//   const [stopv, setStopv] = useState(true);
//   const [stopt, setStopt] = useState(true);
//   const [stopd, setStopd] = useState(true);

//   const [savec, setSavec] = useState(false);
//   const [savev, setSavev] = useState(false);
//   const [savet, setSavet] = useState(false);
//   const [saved, setSaved] = useState(false);

//   const [notec, setNotec] = useState("#");
//   const [notev, setNotev] = useState("#");
//   const [notet, setNotet] = useState("#");
//   const [notex, setNotex] = useState("#");
//   const [notey, setNotey] = useState("#");

//   const [dataGraphc, setDataGraphc] = useState({
//     x: startingNumbers,
//     y: startingNumbersy,
//   });
//   const [dataGraphv, setDataGraphv] = useState({
//     x: startingNumbers,
//     y: startingNumbersy,
//   });
//   const [dataGrapht, setDataGrapht] = useState({
//     x: startingNumbers,
//     y: startingNumbersy,
//   });

//   const [traces, setDataGraph] = useState({
//     x: startingNumbers,
//     y: startingNumbersy,
//     z: startingNumbers,
//   });

//   const [current_timec, setCurrent_timec] = useState(start_time);
//   const [current_timev, setCurrent_timev] = useState(start_time);
//   const [current_timet, setCurrent_timet] = useState(start_time);
//   const [current_timed, setCurrent_timed] = useState(start_time);
//   const [valuex, setValuex] = useState("Select");
//   const [valuey, setValuey] = useState("Select");
//   const [xunit, setxunit] = useState("");
//   const [yunit, setyunit] = useState("");

//   const [iss, setiss] = useState(false);

//   const stopHandlerc = () => {
//     setStopc(!stopc);
//   };

//   const stopHandlerv = () => {
//     setStopv(!stopv);
//   };
//   const stopHandlert = () => {
//     setStopv(!stopv);
//   };
//   const stopHandlerd = () => {
//     setStopv(!stopd);
//   };

//   const saveHandlerc = () => {
//     setSavec(!savec);
//   };
//   const saveHandlerv = () => {
//     setSavev(!savev);
//   };

//   const saveHandlert = () => {
//     setSavev(!savev);
//   };
//   const saveHandlerd = () => {
//     setSavev(!saved);
//   };

//   const handleSelectx = (e) => {
//     if (valuey !== e) {
//       setValuex(e);
//     }
//     // console.log(e);
//   };

//   const handleSelecty = (e) => {
//     if (valuex !== e) setValuey(e);
//     // console.log(e);
//   };

//   const handlexunit = (e) => {
//     if (e === "Temperature") setxunit("&deg;C");
//     else if (e === "Voltage") setxunit("mV");
//     else if (e === "Current") setxunit("mA");
//   };

//   const handleyunit = (e) => {
//     if (e === "Temperature") setyunit("&deg;C");
//     else if (e === "Voltage") setyunit("mV");
//     else if (e === "Current") setyunit("mA");
//   };

//   const client = mqtt.connect("mqtt://192.168.1.14:9001", options);

//   // client.on("connect", () => {
//   //   console.log("connected");
//   topiclink.forEach((x, i) => {
//     client.subscribe(x);
//   });
//   // });
//   useEffect(() => {
//     client.on("message", function (topic, message) {
//       var itemMessagex = "#",
//         itemMessagey = "#";

//       // note = message.toString();
//       // console.log(topic);
//       if (topic === topiclink[0]) {
//         console.log(count);
//         // console.log(message.toString() + "#");
//         const itemMessaget = message.toString();
//         // console.log(message.toString() + "##");

//         setDataGrapht((prev) => {
//           return {
//             x: stopt ? [...prev.x.slice(1), ++count] : [...prev.x],
//             y: stopt ? [...prev.y.slice(1), itemMessaget] : [...prev.y],
//           };
//         });
//         // console.log(dataGrapht);
//         setNotet(itemMessaget);
//         if (stopt) setCurrent_timet(Date());
//       }
//       if (topic === topiclink[1]) {
//         console.log(count2);
//         const itemMessagev = message.toString();
//         setDataGraphv((prev) => {
//           return {
//             x: stopv ? [...prev.x.slice(1), ++count2] : [...prev.x],
//             y: stopv ? [...prev.y.slice(1), itemMessagev] : [...prev.y],
//           };
//         });
//         setNotev(itemMessagev);
//         if (stopv) setCurrent_timev(Date());
//       }
//       if (topic === topiclink[2]) {
//         console.log(count3);
//         const itemMessagec = message.toString();
//         setDataGraphc((prev) => {
//           return {
//             x: stopc ? [...prev.x.slice(1), ++count3] : [...prev.x],
//             y: stopc ? [...prev.y.slice(1), itemMessagec] : [...prev.y],
//           };
//         });
//         setNotec(itemMessagec);
//         if (stopc) setCurrent_timec(Date());
//       }

//       if (valuex != "Select" && valuey != "Select") {
//         topics.forEach((x, i) => {
//           if (x === valuex) {
//             topiclink.forEach((top, j) => {
//               if (i === j) {
//                 if (topic === top) {
//                   itemMessagex = message.toString();
//                 }
//               }
//             });
//           }
//           if (x === valuey) {
//             topiclink.forEach((top, j) => {
//               if (i === j) {
//                 if (topic === top) {
//                   itemMessagey = message.toString();
//                 }
//               }
//             });
//           }
//         });
//         setDataGraph((prev) => {
//           return {
//             x: stopd ? [...prev.x, itemMessagex] : [...prev.x],
//             y: stopd ? [...prev.y, itemMessagey] : [...prev.y],
//             z: stopd ? [...prev.z, count++] : [...prev.z],
//             mode: "markers",
//             type: "scatter3d",
//           };
//         });

//         setNotex(itemMessagex);
//         setNotey(itemMessagey);

//         if (stopd) setCurrent_timed(Date());
//       }
//     });
//   });

//   const formatDateTime = (date) => {
//     const options = {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "numeric",
//       second: "numeric",
//     };
//     return date.toLocaleString(undefined, options);
//   };

//   return (
//     <div className="temp">
//       <div className="plot">
//         <div className="elements">
//           <h1 className="title_head">Perfomance Temperature Dashboard</h1>

//           <button className="button button-33" onClick={stopHandlert}>
//             {stopc ? "Stop" : "Run"}
//           </button>
//           <button class="button button-33" onClick={saveHandlert}>
//             {savec ? "Saving..." : "Save"}
//           </button>
//           <p>Temperature is: {notet} degree C</p>
//           <div className="time_heading">
//             <h4>Start Time : {start_time}</h4>
//             <h4>Current Time : {current_timet}</h4>
//           </div>
//           <div className="plot">
//             <Plot
//               data={[dataGrapht]}
//               layout={{
//                 height: "20vh",
//                 width: "40vh",
//                 title: "Temperature Growth",

//                 yaxis: { title: "Temperature (&deg;C)" },
//               }}
//             />
//           </div>
//         </div>
//         <div className="elements">
//           <h1 className="title_head">Perfomance Voltage Dashboard</h1>

//           <button className="button button-33" onClick={stopHandlerv}>
//             {stopv ? "Stop" : "Run"}
//           </button>
//           <button class="button button-33" onClick={saveHandlerv}>
//             {savev ? "Saving..." : "Save"}
//           </button>
//           <p>Voltage is: {notev}mV</p>
//           <div className="time_heading">
//             <h4>Start Time : {start_time}</h4>
//             <h4>Current Time : {current_timev}</h4>
//           </div>
//           <div className="plot">
//             <Plot
//               data={[dataGraphv]}
//               layout={{
//                 height: "20vh",
//                 width: "40vh",
//                 title: "Voltage Growth",

//                 yaxis: { title: "Voltage (mV)" },
//               }}
//             />
//           </div>
//         </div>
//         {/* <Current />
//         <Voltage /> */}
//       </div>
//       <div className="plot">
//         {/* <Temperature2 /> */}
//         <div className="elements">
//           <h1 className="title_head">Perfomance Current Dashboard</h1>

//           <button className="button button-33" onClick={stopHandlerc}>
//             {stopc ? "Stop" : "Run"}
//           </button>
//           <button class="button button-33" onClick={saveHandlerc}>
//             {savec ? "Saving..." : "Save"}
//           </button>
//           <p>Current is: {notec}mA</p>
//           <div className="time_heading">
//             <h4>Start Time : {start_time}</h4>
//             <h4>Current Time : {current_timec}</h4>
//           </div>
//           <div className="plot">
//             <Plot
//               data={[dataGraphc]}
//               layout={{
//                 height: "20vh",
//                 width: "40vh",
//                 title: "Current Growth",

//                 yaxis: { title: "Current (mA)" },
//               }}
//             />
//           </div>
//         </div>
//         {/* <DatavsData /> */}
//         <div>
//           <h1 className="title_head">Comparison Dashboard</h1>

//           <div className="select">
//             <DropdownButton
//               title={valuex}
//               id="dropdown-menu-align-right"
//               onSelect={handleSelectx}
//             >
//               <Dropdown.Item eventKey="Temperature" onClick={handlexunit}>
//                 Temperature
//               </Dropdown.Item>
//               <Dropdown.Item eventKey="Voltage" onClick={handlexunit}>
//                 Voltage
//               </Dropdown.Item>
//               <Dropdown.Item eventKey="Current" onClick={handlexunit}>
//                 Current
//               </Dropdown.Item>
//             </DropdownButton>
//             <p className="vsgap">Vs</p>
//             <DropdownButton
//               alignRight
//               title={valuey}
//               id="dropdown-menu-align-right"
//               onSelect={handleSelecty}
//             >
//               <Dropdown.Item eventKey="Temperature" onClick={handleyunit}>
//                 Temperature
//               </Dropdown.Item>
//               <Dropdown.Item eventKey="Voltage" onClick={handleyunit}>
//                 Voltage
//               </Dropdown.Item>
//               <Dropdown.Item eventKey="Current" onClick={handleyunit}>
//                 Current
//               </Dropdown.Item>
//             </DropdownButton>
//             <div>
//               <button className="button button-33 " onClick={stopHandlerd}>
//                 {stopd ? "Stop" : "Run"}
//               </button>
//               <button class="button button-33" onClick={saveHandlerd}>
//                 {saved ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//           <p>
//             {valuex} is: {notex}
//           </p>
//           <p>
//             {valuey} is: {notey}
//           </p>
//           <div className="time_heading">
//             <h4>Start Time : {start_time}</h4>
//             <h4>Current Time : {current_timed}</h4>
//           </div>
//           <div className="plot">
//             {valuex === "Select" || valuey === "Select" ? (
//               <div className="axischeck">Select both axises</div>
//             ) : (
//               <Plot
//                 data={[traces]}
//                 layout={{
//                   width: 900,
//                   height: 800,

//                   title: `Simple 3D Scatter`,
//                 }}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       <br />
//     </div>
//   );
// };

// export default History;
