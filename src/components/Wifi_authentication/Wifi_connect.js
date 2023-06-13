import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const Wifi_connect = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Create the initial chart when the component mounts
    const ctx = chartContainerRef.current.getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Scatter Dataset",
            data: [],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
          },
          y: {
            type: "linear",
            position: "left",
          },
        },
      },
    });

    // Start updating the chart in real-time
    const updateChart = () => {
      // Generate random data points
      const newData = {
        x: Math.random() * 10,
        y: Math.random() * 10,
      };

      // Add the new data point to the chart
      chartRef.current.data.datasets[0].data.push(newData);
      chartRef.current.update();

      // Call the updateChart function again after a delay
      setTimeout(updateChart, 1000);
    };

    // Call the updateChart function to start updating the chart
    updateChart();

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartContainerRef} />;
};

export default Wifi_connect;
