// worker.js
// import api from "./testModule";
// import React, { useEffect } from "react";
// import { CSVLink } from "react-csv";
// import d3 from "d3";

const workercode = () => {
  // if ("function" === typeof importScripts) {
  // importScripts("https://cdnjs.cloudflare.com/ajax/libs/d3/4.8.0/d3.min.js");
  onmessage = function (e) {
    const data = e.data;
    const type = data.type;
    // const len = data.size();
    var arg = data.arg;
    // console.log('Message received from main script');
    switch (type) {
      case "csvFormat":
        // console.log('Posting message back to main script');
        // console.log(arg);
        postMessage({
          type: type,
          data: arg,
        });
        break;
      case "blobber":
        //
        const data1 = {
          Temperature: arg["column1"], // Array for column 1
          Current: arg["column2"], // Array for column 2
          Voltage: arg["column3"], // Array for column 3
        };

        console.log(data1);
        // Get the keys (column names) from the data object
        const columns = Object.keys(data1);

        // Create an array of arrays where each inner array represents a column
        // const columnsData = columns.map((column) => data[`${column}`]);

        // Create the CSV content
        // console.log(arg["column1"].length);
        const csvContent = columns
          .map((column) => {
            if (column == "Temperature") {
              console.log(data1[column]);

              const columnsData = Array.isArray(data1[column])
                ? data1[column].join(",")
                : "";
              console.log(columnsData);
              return `"${column}",${data1[column]}`;
            }
          })
          .join("\n");

        // Create the Blob
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        //

        // console.log(blob);
        postMessage({
          type: type,
          data: blob,
        });
        break;
      default:
        console.error("invalid type passed in");
        break;
    }
  };
  // }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
