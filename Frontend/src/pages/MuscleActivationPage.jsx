import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MuscleSVG from "../components/MuscleSVG";
import { muscleGroups, allMuscles } from "../data/muscleConfig";
import headingBackground from "../assets/background3.jpg";

export default function MuscleActivationPage() {
  const [activation, setActivation] = useState(
    Object.fromEntries(allMuscles.map((id) => [id, 0]))
  );

  useEffect(() => {
    const ws = new WebSocket("ws://172.20.10.12:8000/ws"); // your backend IP
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setActivation((prev) => ({
        ...prev,
        ...data, // overwrite only the muscles sent
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
          backgroundPosition: "center",
          color: "#fff",
        }}
      >
        <h1>Muscle Activation Map</h1>
        <p>Control and visualize individual muscle activation in real-time.</p>
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
                    {Math.round((activation[id] / 3.3) * 100)} {/* Convert voltage to 0-100% */}
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
