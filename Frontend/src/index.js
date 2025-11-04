import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";               // Your main App component
import "./styles/team.css";            // Global team page styles

// Dynamically add the <model-viewer> script
const script = document.createElement("script");
script.type = "module";
script.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
document.head.appendChild(script);

// Create root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the React app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
