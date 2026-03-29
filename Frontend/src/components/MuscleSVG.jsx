import React, { useEffect, useRef } from "react";
import { ReactComponent as MusclesSVG } from "../assets/Anatomy_Chart.svg";

export default function MuscleSVG({ activation, kneeAngles = {} }) {
  const wrapperRef = useRef();

  useEffect(() => {
    if (!wrapperRef.current) return;
    const svgElement = wrapperRef.current.querySelector("svg");
    if (!svgElement) return;

    // 🔴 Update muscle colors
    Object.entries(activation).forEach(([muscleId, value]) => {
      const muscleGroup = svgElement.querySelector(`#${muscleId}`);
      if (muscleGroup) {
        const normalized = Math.min(Math.max(value / 3.3, 0), 1);

        muscleGroup.querySelectorAll("path").forEach((path) => {
          path.style.fill = `rgba(255,0,0,${normalized})`;
          path.style.fillOpacity = normalized;
        });
      }
    });

    // 🟢 OPTIONAL: Update knee angle text inside SVG (if IDs exist)
    const leftText = svgElement.querySelector("#left_knee_text");
    const rightText = svgElement.querySelector("#right_knee_text");

    if (leftText && kneeAngles.left !== undefined) {
      leftText.textContent = `${kneeAngles.left.toFixed(1)}°`;
    }

    if (rightText && kneeAngles.right !== undefined) {
      rightText.textContent = `${kneeAngles.right.toFixed(1)}°`;
    }

  }, [activation, kneeAngles]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // needed for overlay
      }}
    >
      <MusclesSVG
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "600px",
          maxWidth: "100%",
          objectFit: "contain",
        }}
      />

      {/* 🟢 FALLBACK: Overlay knee angles (if SVG has no text IDs) */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "0.9rem",
        }}
      >
        <div>Left Knee: {kneeAngles.left?.toFixed(1) ?? 0}°</div>
        <div>Right Knee: {kneeAngles.right?.toFixed(1) ?? 0}°</div>
      </div>
    </div>
  );
}