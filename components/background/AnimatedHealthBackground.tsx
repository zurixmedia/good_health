import React from "react";
import { BackgroundGradient } from "./BackgroundGradient";
import { FloatingMedicalPattern } from "./FloatingMedicalPattern";

export function AnimatedHealthBackground() {
  return (
    <div 
      className="fixed inset-0 -z-50 w-full h-full overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <BackgroundGradient />
      <FloatingMedicalPattern />
    </div>
  );
}
