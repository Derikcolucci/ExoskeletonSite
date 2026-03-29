import React from "react";

const ModelViewer = () => {
  return (
    <model-viewer
      src="/exo_v2.glb"
      alt="Exoskeleton Model"
      camera-controls
      auto-rotate
      disable-zoom
      // Slightly increase the size
      scale="2 2 2"
      style={{ width: "100%", height: "500px" }}
    ></model-viewer>
  );
};

export default ModelViewer;