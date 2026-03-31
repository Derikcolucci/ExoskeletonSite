import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MuscleSVG from "../components/MuscleSVG";
import { muscleGroups, allMuscles } from "../data/muscleConfig";
import headingBackground from "../assets/FAU_Background.jpeg";

export default function MuscleActivationPage() {
  const [activation, setActivation] = useState(
    Object.fromEntries(allMuscles.map((id) => [id, 0]))
  );
  const [kneeAngles, setKneeAngles] = useState({
    left_knee_angle: 0,
    right_knee_angle: 0,
  });

  useEffect(() => {
    //const ws = new WebSocket("ws://172.20.10.12:5000/ws"); // your backend IP 
    const ws = new WebSocket("ws://192.168.1.83:5000/ws");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Separate EMG channels from knee angles
      const newActivation = {};
      let newKneeAngles = {};
      Object.entries(data).forEach(([key, value]) => {
        if (key === "left_knee_angle" || key === "right_knee_angle") {
          newKneeAngles[key] = value;
        } else {
          newActivation[key] = value;
        }
      });

      setActivation((prev) => ({
        ...prev,
        ...newActivation,
      }));

      setKneeAngles((prev) => ({
        ...prev,
        ...newKneeAngles,
      }));
    };

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  return (
    <div className="emg-page">
      <Navbar />

      <header
        className="emg-header"
        style={{
          backgroundImage: `url(${headingBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          color: "#fff",
        }}
      >
        <h1>Visualize Muscle Activation</h1>
      </header>

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
          {/* Knee angles display */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ borderBottom: "2px solid #000", paddingBottom: "0.4rem", marginBottom: "1rem" }}>
              Knee Angles
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
              <span>Left Knee</span>
              <span>{Math.round(kneeAngles.left_knee_angle)}°</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Right Knee</span>
              <span>{Math.round(kneeAngles.right_knee_angle)}°</span>
            </div>
          </div>

          {Object.entries(muscleGroups).map(([group, muscles]) => (
            <div key={group} style={{ marginBottom: "2rem" }}>
              <h3 style={{ borderBottom: "2px solid #000", paddingBottom: "0.4rem", marginBottom: "1rem" }}>
                {group}
              </h3>
              {muscles.map((id) => (
                <div
                  key={id}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}
                >
                  <span style={{ fontSize: "0.95rem", color: "#111" }}>
                    {id.replaceAll("_", " ")}
                  </span>
                  <span style={{ minWidth: "40px", textAlign: "right", marginRight: "0.5rem" }}>
                    {Math.round((activation[id] / 3.3) * 100)}% {/* Convert voltage to 0-100% */}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", minWidth: "300px", maxHeight: "600px" }}>
          <MuscleSVG activation={activation} />
        </div>
      </section>
    </div>
  );
}