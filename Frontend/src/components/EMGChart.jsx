import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "../styles/EMG.css";

const EMGChart = ({ wsUrl }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // Initialize chart (same as before)
  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [], // starts empty
        datasets: [
          {
            label: "EMG Voltage (V)",
            data: [], // starts empty
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

    return () => {
      newChart.destroy();
    };
  }, []);

  // Handle WebSocket data (only if wsUrl exists)
  useEffect(() => {
    if (!chartInstance || !wsUrl) return; // Skip WebSocket in production

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket disconnected!");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (event) => {
      try {
        const voltage = JSON.parse(event.data).voltage;
        const data = chartInstance.data;

        // Add timestamp label
        data.labels.push(new Date().toLocaleTimeString());
        data.datasets[0].data.push(voltage);

        // Keep only last 500 points
        if (data.labels.length > 500) {
          data.labels.shift();
          data.datasets[0].data.shift();
        }

        chartInstance.update();
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    return () => ws.close();
  }, [chartInstance, wsUrl]);

  return <canvas ref={chartRef} className="emg-chart-canvas"></canvas>;
};

export default EMGChart;
