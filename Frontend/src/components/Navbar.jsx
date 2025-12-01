import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/team.css";
import navBackground from "../assets/background1.jpg";

const Navbar = ({ teamMembers, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav
        className="team-navbar"
        style={{
          backgroundImage: `url(${navBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Left: Hamburger for mobile page navigation */}
        <div className="navbar-left">
          <button className="hamburger-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        {/* Right: Desktop buttons scroll to sections */}
        <div className="navbar-right">
          {teamMembers?.map((member, index) => (
            <button
              key={index}
              className="team-nav-btn"
              onClick={() => onSelect && onSelect(index)}
            >
              {member.name}
            </button>
          ))}
          {/* EMG Live button removed from desktop navbar */}
        </div>
      </nav>

      {/* Mobile Overlay → page navigation */}
      <div className={`overlay-panel ${isOpen ? "show" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>
          &times;
        </button>
        <div className="overlay-links">
          <button
            className="team-nav-btn"
            onClick={() => {
              navigate("/"); // Go to DesignPage
              setIsOpen(false);
            }}
          >
            Design
          </button>
          <button
            className="team-nav-btn"
            onClick={() => {
              navigate("/team"); // Go to TeamPage
              setIsOpen(false);
            }}
          >
            Team
          </button>
          {/* EMG Page Button only in hamburger menu */}
          <button
            className="team-nav-btn"
            onClick={() => {
              navigate("/emg-live"); // Go to EMGPage
              setIsOpen(false);
            }}
          >
            EMG Live
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
