import React from "react";
import Navbar from "../components/Navbar";
import EMGChart from "../components/EMGChart"; // Make sure this is in src/components/
import headingBackground from "../assets/background3.jpg";
import "../styles/EMG.css";

const EMGPage = () => {
  // Automatically switch WebSocket URL between local hotspot and production
  const backendIp =
    window.location.hostname === "localhost"
      ? "172.20.10.12" // local IP of your computer when using hotspot
      : "exoskeletonsite.netlify.app"; // production domain

  const wsUrl = `ws://${backendIp}:8000/ws`; // WebSocket URL (adjust port if different)

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
