import React, { useEffect, useRef } from "react";
import { ReactComponent as MusclesSVG } from "../assets/Anatomy_Chart.svg";

export default function MuscleSVG({ activation }) {
  const wrapperRef = useRef();

  useEffect(() => {
    if (!wrapperRef.current) return;
    const svgElement = wrapperRef.current.querySelector("svg");
    if (!svgElement) return;

    Object.entries(activation).forEach(([muscleId, value]) => {
      const muscleGroup = svgElement.querySelector(`#${muscleId}`);
      if (muscleGroup) {
        const normalized = Math.min(Math.max((value / 3.3), 0), 1);
        muscleGroup.querySelectorAll("path").forEach((path) => {
          path.style.fill = `rgba(255,0,0,${normalized})`;
          path.style.fillOpacity = normalized;
        });
      }
    });
  }, [activation]);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
