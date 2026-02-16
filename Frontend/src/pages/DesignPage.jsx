import React, { useState, useEffect, Suspense } from "react";
import Navbar from "../components/Navbar";
import CurrentDesignSection from "../components/CurrentDesignSection";
import TechStackSection from "../components/TechStackSection";
import ModelViewer from "../components/ModelViewer";
import missionBackground from "../assets/FAU_Background.jpeg";
import background1 from "../assets/background4.jpg";
import missionStatement from "../data/missionStatement";

const DesignPage = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
      setOffsetY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="design-page">
      {/* Navbar */}
      <Navbar />

      {/* Mission Statement */}
      <section
        className="mission-statement"
        style={{
          backgroundImage: `url(${missionBackground})`,
          backgroundSize: "cover",
          backgroundPosition: `center ${offsetY * 0.3}px`,
          backgroundRepeat: "no-repeat",
          display: "grid",
          justifyItems: "center",   // horizontal center
          alignContent: "start",
          textAlign: "center",
          paddingTop: "10px",
          minHeight: "500px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "800px" }}>
          <h1>{missionStatement.title}</h1>
          <p>{missionStatement.text}</p>
        </div>
      </section>

      {/* Current Design Section */}
      <section className="current-design-section">
        <CurrentDesignSection />
        <div className="model">
          <Suspense fallback={<div>Loading Model...</div>}>
            <ModelViewer />
          </Suspense>
        </div>
      </section>

      {/* Tech Stack Section with parallax */}
      <section
        className="tech-stack-section"
        style={{
          backgroundImage: `url(${background1})`,
          backgroundPosition: `center ${offsetY * 0.05}px`, // parallax effect
        }}
      >
        <TechStackSection />
      </section>

      {/* Scroll to Top Button */}
      {showTopBtn && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default DesignPage;
