import { useState } from "react";
import Navbar from "../components/Navbar";
import MuscleSVG from "../components/MuscleSVG";
import { muscleGroups, allMuscles } from "../data/muscleConfig";
import headingBackground from "../assets/background3.jpg";
import "../styles/EMG.css";

export default function MuscleActivationPage() {
  // Muscle activation state (0-100)
  const [activation, setActivation] = useState(
    Object.fromEntries(allMuscles.map((id) => [id, 0]))
  );

  // ===== Slider tester state =====
  const [testValue, setTestValue] = useState(50);

  // Update all muscles via test slider
  const handleTestSlider = (value) => {
    setTestValue(value);
    setActivation((prev) =>
      Object.fromEntries(allMuscles.map((id) => [id, value]))
    );
  };

  return (
    <div className="emg-page">
      <Navbar />

      {/* Header */}
      <header
        className="emg-header"
        style={{
          backgroundImage: `url(${headingBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
        }}
      >
        <h1>Muscle Activation Map</h1>
        <p>Control and visualize individual muscle activation in real-time.</p>
      </header>

      {/* Main Section */}
      <section
        className="emg-chart-section"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          alignItems: "flex-start",
          flexWrap: "nowrap",
          padding: "2rem",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            flex: 1,
            minWidth: "360px",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Test Slider */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Test Muscle Activation: {testValue}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={testValue}
              onChange={(e) => handleTestSlider(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          {/* Muscle List */}
          {Object.entries(muscleGroups).map(([group, muscles]) => (
            <div key={group} style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  borderBottom: "2px solid #000",
                  paddingBottom: "0.4rem",
                  marginBottom: "1rem",
                }}
              >
                {group}
              </h3>
              {muscles.map((id) => (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.8rem",
                  }}
                >
                  <span style={{ fontSize: "0.95rem", color: "#111" }}>
                    {id.replaceAll("_", " ")}
                  </span>
                  <span
                    style={{
                      minWidth: "40px",
                      textAlign: "right",
                      marginRight: "0.5rem",
                    }}
                  >
                    {activation[id]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL: Muscle SVG */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minWidth: "300px",
            maxHeight: "600px",
          }}
        >
          <MuscleSVG activation={activation} />
        </div>
      </section>
    </div>
  );
}
