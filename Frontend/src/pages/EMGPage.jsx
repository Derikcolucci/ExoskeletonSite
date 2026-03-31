import React, { useState } from "react";
import Navbar from "../components/Navbar";
import EMGChart from "../components/EMGChart"; // Make sure this is in src/components/
import headingBackground from "../assets/FAU_Background.jpeg";
import "../styles/EMG.css";

const EMG_MUSCLES = [
  "Left_Semitendinosus",
  "Right_Semitendinosus",
  "Left_Bicep_Femoris",
  "Right_Bicep_Femoris",
  "Left_Rectus_Femoris",
  "Right_Rectus_Femoris",
  "Left_Vastus_Lateralis",
  "Right_Vastus_Lateralis",
];

const EMGPage = () => {
  const [selectedMuscle, setSelectedMuscle] = useState("Left_Semitendinosus");

  // Determine WebSocket URL
  const wsUrl =
    process.env.NODE_ENV === "development"
      ? `ws://${window.location.hostname}:5000/ws`
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

        {/* Muscle selector bar */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <label
            htmlFor="muscle-select"
            style={{ fontWeight: 500, fontSize: "1rem" }}
          >
            Select Muscle:
          </label>
          <select
            id="muscle-select"
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            style={{
              padding: "0.4rem 0.6rem",
              fontSize: "0.95rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              minWidth: "220px",
            }}
          >
            {EMG_MUSCLES.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Chart component receives selected muscle */}
        <EMGChart wsUrl={wsUrl} selectedMuscle={selectedMuscle} />
      </section>
    </div>
  );
};

export default EMGPage;