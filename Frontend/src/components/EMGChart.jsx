import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "../styles/EMG.css";

const EMGChart = ({ wsUrl, selectedMuscle }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: selectedMuscle.replaceAll("_", " "),
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
          y: { beginAtZero: true, max: 100 }, // 0-100% scale
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.raw.toFixed(1)}%`;
              },
            },
          },
        },
      },
    });

    setChartInstance(newChart);

    return () => {
      newChart.destroy();
    };
  }, [selectedMuscle]); // re-create chart when muscle changes

  // WebSocket data
  useEffect(() => {
    if (!chartInstance || !wsUrl) return;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onclose = () => console.log("WebSocket disconnected!");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);

        const value = incoming[selectedMuscle] !== undefined
          ? incoming[selectedMuscle] * 100 // convert 0-1 to %
          : 0;

        const data = chartInstance.data;

        data.labels.push(new Date().toLocaleTimeString());
        data.datasets[0].data.push(value);

        if (data.labels.length > 200) {
          data.labels.shift();
          data.datasets[0].data.shift();
        }

        chartInstance.update();
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    return () => ws.close();
  }, [chartInstance, wsUrl, selectedMuscle]);

  return <canvas ref={chartRef} className="emg-chart-canvas"></canvas>;
};

export default EMGChart;