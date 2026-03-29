import React from "react";
import "../styles/design.css";

const CurrentDesignSection = () => {
  return (
    <div className="current-design-description">
      <div>
        <span className="badge">Latest Version</span>
        <h2>Current Design - 2.1</h2>
        <ul className="custom-bullets">
          <li>
            Exoskeleton engineered for lower-limb rehabilitation, <br />
            combining mechanical support with user-focused comfort.
          </li>
          <li>
            Advanced 3D-printed frame using PLA for high-impact areas <br />
            and TPU for cushioning, ensuring durability where needed <br />
            and flexibility where it counts.
          </li>
          <li>
            Optimized backing and spring-assisted joints enhance comfort, <br />
            stabilize motion, and reduce setup time, supporting smoother <br />
            rehabilitation sessions.
          </li>
          <li>
            Modular mounting with screws, Velcro, and zip ties allows <br />
            secure assembly while enabling quick adjustments for sensors <br />
            and electrical components.
          </li>
          <li>
            Integrated software system manages EMG and positional sensors, <br />
            delivers real-time feedback, and provides interactive 3D <br />
            visualization for both patients and clinicians.
          </li>
          <li>
            Performance-tested with simulations and physical trials, <br />
            ensuring reliability, accurate sensor readings, and precise <br />
            assistance during natural gait cycles.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CurrentDesignSection;