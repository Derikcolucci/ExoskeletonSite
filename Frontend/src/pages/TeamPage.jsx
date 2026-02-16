import React, { useRef, useState, useEffect } from "react";
import { teamMembers } from "../data/teamMembers";
import Navbar from "../components/Navbar";
import TeamMemberSection from "../components/TeamMemberSection";
import "../styles/team.css";
import background from "../assets/FAU_Background.jpeg"; // Page background

const TeamPage = () => {
  const sectionRefs = useRef([]);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const scrollToMember = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="team-page"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <Navbar teamMembers={teamMembers} onSelect={scrollToMember} />

      <main className="team-container">
        {teamMembers.map((member, i) => (
          <section
            key={i}
            ref={(el) => (sectionRefs.current[i] = el)}
            id={member.name.replace(/\s+/g, "-").toLowerCase()}
          >
            <TeamMemberSection member={member} reverse={i % 2 === 1} />
          </section>
        ))}
      </main>

      {showTopBtn && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default TeamPage;
