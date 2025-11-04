import React, { useState } from "react";

// Import images properly
import esp32Img from "../assets/esp32.png";
import as5600Img from "../assets/AS5600.png";
import emgImg from "../assets/EMG.png";

// Example device data
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
    id: 2,
    name: "AS5600 Magnetic Rotary Encoder",
    description: [
      "Tracks lower limb orientation and joint rotation",
      "Measures movement patterns to determine muscle activation",
      "Detects potential issues or weaknesses in specific muscles",
      "Provides input for machine learning diagnostics",
    ],
    image: as5600Img,
  },
  {
    id: 3,
    name: "MayoWare 2.0 EMG Sensor",
    description: [
      "Captures muscle electrical activity (voltage readings)",
      "Works in conjunction with AS5600 to analyze movement",
      "Feeds data into the ML model for diagnostics",
      "Helps identify abnormal muscle usage or potential rehabilitation needs",
    ],
    image: emgImg,
  },
];

const TechStackSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % devices.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + devices.length) % devices.length);
  };

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="tech-stack-section">
      {/* Tech Stack Title */}
      <h2 className="tech-stack-title">Tech Stack</h2>

      {/* Left Description */}
      <div className="tech-info">
        <h3>{devices[activeIndex].name}</h3>
        <ul>
          {devices[activeIndex].description.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Carousel Wrapper */}
      <div className="tech-carousel-wrapper">
        {/* Carousel */}
        <div className="tech-carousel">
          {devices.map((device, index) => {
            const offset = index - activeIndex;
            return (
              <div
                key={device.id}
                className="tech-item"
                style={{
                  transform: `rotateY(${offset * 120}deg) translateZ(250px)`,
                  position: offset === 0 ? "relative" : "absolute",
                  opacity: offset === 0 ? 1 : 0.5,
                  zIndex: offset === 0 ? 10 : 5,
                }}
                onClick={handleNext}
              >
                <img
                  src={device.image}
                  alt={device.name}
                  style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                />
              </div>
            );
          })}
        </div>

        {/* Indicators under carousel */}
        <div className="tech-carousel-dots">
          {devices.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackSection;
