import React from "react";

const ModelViewer = () => {
  return (
    <model-viewer
      src="/exoskeleton.glb"   // path to your model in public folder
      alt="Exoskeleton Model"
      camera-controls
      auto-rotate
      disable-zoom
      style={{ width: "100%", height: "500px" }}
    ></model-viewer>
  );
};

export default ModelViewer;
