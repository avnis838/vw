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
        var data1 = [];

        if (arg["column1"] !== undefined) {
          data1 = { ...data1, Topic1: arg["column1"] };
        }
        if (arg["column2"] !== undefined) {
          data1 = { ...data1, Topic2: arg["column2"] };
        }
        if (arg["column3"] !== undefined) {
          data1 = { ...data1, Topic3: arg["column3"] };
        }

        console.log(data1);
        // Get the keys (column names) from the data object
        const columns = Object.keys(data1);

        const csvContent = columns
          .map((column) => {
            const columnData = Array.isArray(data1[column])
              ? data1[column]
              : [data1[column]];
            return `"${column}",${columnData.join("\n")}`;
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
        console.error("Invalid type passed in");
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
