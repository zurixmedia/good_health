import React from "react";

export function BackgroundGradient() {
  return (
    <div className="absolute inset-0 -z-20 overflow-hidden bg-white select-none pointer-events-none">
      {/* Base Light Blue Tint and Radial Gradients */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-[#FFFFFF] via-[#F8FCFF] to-[#F1F7FC] opacity-95" 
        aria-hidden="true"
      />
      {/* Top Right Subtle Radial Glow */}
      <div 
        className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[1200px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.06)_0%,rgba(224,242,254,0.04)_40%,rgba(255,255,255,0)_70%)] blur-2xl"
        aria-hidden="true"
      />
      {/* Bottom Left Subtle Radial Glow */}
      <div 
        className="absolute -bottom-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[1000px] rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.05)_0%,rgba(99,102,241,0.03)_50%,rgba(255,255,255,0)_75%)] blur-2xl"
        aria-hidden="true"
      />
      {/* Center Soft Healing Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[50vh] max-w-[1400px] rounded-full bg-[radial-gradient(circle,rgba(240,253,250,0.1)_0%,rgba(255,255,255,0)_80%)] blur-3xl"
        aria-hidden="true"
      />
    </div>
  );
}
