import React, { useState } from "react";

import esp32Img from "../assets/esp32.png";
import as5600Img from "../assets/AS5600.png";
import emgImg from "../assets/EMG.png";
import mpuImg from "../assets/MPU6050.png";
import motorImg from "../assets/motor.png";

const devices = [
  {
    id: 1,
    name: "ESP32 Microcontroller",
    description: [
      "Main controller of the ExoSuit",
      "Handles all communication between sensors",
      "Processes real-time sensor data for movement and diagnostics",
      "Coordinates data flow to the ML model for analysis",
    ],
    image: esp32Img,
  },
  {
    id: 3,
    name: "EMG Sensor",
    description: [
      "Captures muscle electrical activity (voltage readings)",
      "Works in conjunction with AS5600 to analyze movement",
      "Feeds data into the ML model for diagnostics",
      "Helps identify abnormal muscle usage or potential rehabilitation needs",
    ],
    image: emgImg,
  },
  {
    id: 4,
    name: "MPU6050 IMU Sensor",
    description: [
      "Measures acceleration and rotational motion using a 3-axis accelerometer and gyroscope",
      "Tracks limb orientation and movement dynamics during exercises",
      "Works alongside EMG and AS5600 sensors to correlate motion with muscle activity",
      "Provides motion data used by the ML model to detect biomechanical patterns and fatigue",
    ],
    image: mpuImg,
  },
  {
    id: 5,
    name: "AK45-36 KV80 Brushless Motor",
    description: [
      "High-torque brushless motor used to actuate and assist lower-limb movement",
      "Provides controlled rotational motion for joint mechanisms in the system",
      "Works with encoder feedback (AS5600) to precisely track joint angle and position",
      "Enables closed-loop control and realistic movement testing for the biomechanical model",
    ],
    image: motorImg,
  },
];

const TechStackSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const angleStep = 360 / devices.length;
  const radius = 300;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % devices.length);
  };

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="tech-stack-section">

      <h2 className="tech-stack-title">Tech Stack</h2>

      <div className="tech-info">
        <h3>{devices[activeIndex].name}</h3>
        <ul>
          {devices[activeIndex].description.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      <div
        className="tech-carousel-wrapper"
        style={{
          perspective: "1400px",
          width: "500px",
          height: "350px",
          margin: "0 auto",
          position: "relative",
        }}
      >

        <div
          className="tech-carousel"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            transformStyle: "preserve-3d",
            transition: "transform 0.8s ease",
            transform: `rotateY(-${activeIndex * angleStep}deg)`,
          }}
        >
          {devices.map((device, index) => {
            const angle = angleStep * index;
            const offset = index - activeIndex;
            const isActive = offset === 0;

            return (
              <div
                key={device.id}
                onClick={handleNext}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(${radius}px)
                    translate(-50%, -50%)
                    scale(${isActive ? 1 : 0.75})
                  `,
                  transition: "all 0.7s ease",
                  opacity: isActive ? 1 : 0.2,
                  filter: isActive ? "none" : "blur(1px)",
                  cursor: "pointer",
                }}
              >
                <img
                  src={device.image}
                  alt={device.name}
                  style={{
                    width: "220px",
                    height: "220px",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              </div>
            );
          })}
        </div>

      </div>

      {/* Dots slightly below carousel */}
      <div
        className="tech-carousel-dots"
        style={{
          marginTop: "10px", // slightly below
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {devices.map((_, index) => (
          <div
            key={index}
            onClick={() => handleIndicatorClick(index)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: index === activeIndex ? "#000" : "#bbb",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

    </div>
  );
};

export default TechStackSection;