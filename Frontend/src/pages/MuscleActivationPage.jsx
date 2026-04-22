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

  const [currentActivity, setCurrentActivity] = useState("idle");

  useEffect(() => {
    // ✅ FIXED: correct backend port
    const wsUrl =
      process.env.NODE_ENV === "development"
        ? "ws://localhost:5000/ws"
        : "wss://YOUR_PUBLIC_WS_SERVER/ws";

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // 🔍 DEBUG (optional, remove later)
        // console.log("WS DATA:", data);

        let newActivation = {};
        let newKneeAngles = {};
        let newActivity = null;

        // =========================
        // SAFE PARSING (MATCH CHART PAGE)
        // =========================
        Object.entries(data).forEach(([key, value]) => {
          if (key === "left_knee_angle" || key === "right_knee_angle") {
            newKneeAngles[key] = value;
          } 
          else if (key === "current_activity") {
            newActivity = value;
          } 
          else if (allMuscles.includes(key)) {
            newActivation[key] = value;
          }
        });

        // =========================
        // STATE UPDATES
        // =========================
        setActivation((prev) => ({
          ...prev,
          ...newActivation,
        }));

        setKneeAngles((prev) => ({
          ...prev,
          ...newKneeAngles,
        }));

        if (newActivity !== null) {
          setCurrentActivity(newActivity);
        }

      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error:", err);

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
          {/* CURRENT ACTIVITY */}
          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                borderBottom: "2px solid #000",
                paddingBottom: "0.4rem",
                marginBottom: "1rem",
              }}
            >
              Current Activity
            </h3>

            <div
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#0077ff",
              }}
            >
              {currentActivity.replaceAll("_", " ")}
            </div>
          </div>

          {/* KNEE ANGLES */}
          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                borderBottom: "2px solid #000",
                paddingBottom: "0.4rem",
                marginBottom: "1rem",
              }}
            >
              Knee Angles
            </h3>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Left Knee</span>
              <span>{Math.round(kneeAngles.left_knee_angle)}°</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Right Knee</span>
              <span>{Math.round(kneeAngles.right_knee_angle)}°</span>
            </div>
          </div>

          {/* MUSCLE GROUPS */}
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
                    marginBottom: "0.8rem",
                  }}
                >
                  <span>{id.replaceAll("_", " ")}</span>
                  <span>
                    {Math.round(((activation[id] || 0) / 3.3) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <MuscleSVG activation={activation} />
        </div>
      </section>
    </div>
  );
}