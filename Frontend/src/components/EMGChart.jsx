import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "../styles/EMG.css";

const EMGChart = ({ wsUrl }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // Initialize chart
  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "EMG Voltage (V)",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.2,
            fill: false,
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        scales: {
          x: { display: false },
          y: { beginAtZero: true, suggestedMax: 3.5 },
        },
      },
    });

    setChartInstance(newChart);

    // Cleanup: destroy chart on unmount
    return () => {
      newChart.destroy();
    };
  }, []);

  // Handle WebSocket data
  useEffect(() => {
    if (!chartInstance || !wsUrl) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket disconnected!");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (event) => {
      try {
        const voltage = JSON.parse(event.data).voltage;
        const data = chartInstance.data;

        // Use timestamp as x-axis label for better readability
        data.labels.push(new Date().toLocaleTimeString());
        data.datasets[0].data.push(voltage);

        // Keep only the last 500 points
        if (data.labels.length > 500) {
          data.labels.shift();
          data.datasets[0].data.shift();
        }

        chartInstance.update();
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    // Cleanup WebSocket on unmount
    return () => ws.close();
  }, [chartInstance, wsUrl]);

  return <canvas ref={chartRef} className="emg-chart-canvas"></canvas>;
};

export default EMGChart;
