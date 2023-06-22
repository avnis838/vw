import { useEffect } from "react";
import Worker from "./worker";

export default function Temp() {
  const myWorker = new Worker();
  useEffect(() => {
    myWorker.postMessage("start");
    myWorker.onmessage = (e) => {
      console.log("Time Taken", e.data);
    };
  }, []);

  return <div>Good from web</div>;
}
