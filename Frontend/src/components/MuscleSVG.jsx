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
        position: "relative", // keep for optional SVG text
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
    </div>
  );
}