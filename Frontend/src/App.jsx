import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TeamPage from "./pages/TeamPage";
import DesignPage from "./pages/DesignPage";
import EMGPage from "./pages/EMGPage"; // EMGPage imports EMGChart internally

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default page */}
        <Route path="/" element={<DesignPage />} />

        {/* Team page */}
        <Route path="/team" element={<TeamPage />} />

        {/* EMG Live page */}
        <Route path="/emg-live" element={<EMGPage />} />

        {/* Redirect any unknown routes to DesignPage */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
