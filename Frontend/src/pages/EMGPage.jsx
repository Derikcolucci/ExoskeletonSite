import React from "react";
import Navbar from "../components/Navbar";
import EMGChart from "../components/EMGChart"; // Make sure this is in src/components/
import headingBackground from "../assets/background3.jpg";
import "../styles/EMG.css";

const EMGPage = () => {
  // Automatically switch WebSocket URL between local testing and static preview
  const wsUrl =
    window.location.hostname === "localhost"
      ? "ws://172.20.10.12:8000/ws" // Local backend
      : null; // No backend on Netlify, use dummy data

  return (
    <div className="emg-page">
      {/* Navbar */}
      <Navbar />

      {/* Page Header with background image */}
      <header
        className="emg-header"
        style={{
          backgroundImage: `url(${headingBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff", // ensure text is visible
        }}
      >
        <h1>Live EMG Signal</h1>
        <p>Streaming real-time EMG voltage from your ESP32.</p>
      </header>

      {/* EMG Chart Section */}
      <section className="emg-chart-section">
        <h2>EMG Voltage Reading</h2>
        <EMGChart wsUrl={wsUrl} />
      </section>
    </div>
  );
};

export default EMGPage;
