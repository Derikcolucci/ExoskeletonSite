import React from "react";
import Navbar from "../components/Navbar";
import EMGChart from "../components/EMGChart"; // Make sure this is in src/components/
import headingBackground from "../assets/FAU_Background.jpeg";
import "../styles/EMG.css";

const EMGPage = () => {
  // Determine WebSocket URL
  // Uses local backend in development, disables in production
  const wsUrl =
    process.env.NODE_ENV === "development"
      ? `ws://${window.location.hostname}:8000/ws`
      : null;

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
          backgroundPosition: "center 40%",
          backgroundRepeat: "no-repeat",
          color: "#fff",
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
