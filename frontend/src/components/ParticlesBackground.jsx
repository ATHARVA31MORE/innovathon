import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; 

const ParticlesBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false }, // Change to false to use container dimensions
          background: { color: "transparent" }, // Make background transparent
          particles: {
            number: { value: 80 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.3, random: true },
            size: { value: { min: 1, max: 4 } },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              outModes: "out",
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 },
            },
          },
        }}
        style={{ 
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
      />
    </div>
  );
};

export default ParticlesBackground;