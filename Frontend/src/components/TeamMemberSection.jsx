import React from "react";
import "../styles/team.css";
import linkedinLogo from "../assets/linkedin.png"; // Your downloaded LinkedIn logo

const TeamMemberSection = ({ member, reverse }) => {
  return (
    <div className={`member-section ${reverse ? "reverse" : ""}`}>
      <div
        className="member-image"
        style={{ backgroundImage: `url(${member.img})` }}
      />
      <div className="member-info">
        <h2>
          {member.name} <span>{member.title}</span>
        </h2>
        <h4>{member.role}</h4>
        <p>{member.description}</p>
        <div className="links">
          <a href={member.linkedin} target="_blank" rel="noreferrer">
            <img src={linkedinLogo} alt="LinkedIn" /> LinkedIn
          </a>
          <a href={member.resume} target="_blank" rel="noreferrer">
            🔗 Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberSection;
