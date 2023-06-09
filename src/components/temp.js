import React from "react";
import Thermometer from "react-thermometer-component";

const styles = {
  dial: {
    display: "inline-block",
    width: `300px`,
    height: `auto`,
    color: "#000",
    border: "0.5px solid #fff",
    padding: "2px",
  },
  title: {
    fontSize: "1em",
    color: "#000",
    marginTop: "15px",
  },
};

const Temp = ({ id, value, title }) => {
  return (
    <div style={styles.dial}>
      <Thermometer
        theme="light"
        value={value}
        max="50"
        steps="1"
        format="°C"
        size="normal"
        height="180"
      />
      <div style={styles.title}>
        {title}: {value}°C
      </div>
    </div>
  );
};

export default Temp;
