import React from "react";
import "../styles/design.css"; // make sure to create or import your CSS

const CurrentDesignSection = () => {
  return (
    <div className="current-design-description">
      <div>
        <span className="badge">Latest Version</span>
        <h2>Current Design - 1.0.0</h2>
        <ul className="custom-bullets">
          <li>This is a placeholder exoskeleton design.</li>
          <li>You can rotate and zoom the model using your mouse.</li>
          <li>It will be replaced with our model shortly.</li>
        </ul>
      </div>
    </div>
  );
};

export default CurrentDesignSection;
