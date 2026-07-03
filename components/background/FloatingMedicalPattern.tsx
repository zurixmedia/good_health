"use client";

import React, { useEffect } from "react";

interface FloatingItem {
  id: string;
  x: number; // percentage left
  y: number; // percentage top
  scale: number;
  rotation: number;
  iconIndex?: number; // undefined means it's a dot
  opacity: number;
  animationClass: string;
  visibilityClass: string; // Tailwind responsiveness helper classes
}

// 13 minimal medical-themed outline SVGs
const ICONS = [
  // 0: Medical cross
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  // 1: Heartbeat (ECG)
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12h3l3-9 4 18 3-12 3 3h2" />
    </svg>
  ),
  // 2: Shield
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  // 3: Heart
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  // 4: Stethoscope
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.8 2.4A2.4 2.4 0 0 0 2.4 4.8v6a7.2 7.2 0 0 0 14.4 0V4.8a2.4 2.4 0 0 0-2.4-2.4h-2.4" />
      <path d="M12 18a6 6 0 0 0 6-6v-1" />
      <path d="M12 18v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3" />
      <circle cx="12" cy="18" r="1" />
    </svg>
  ),
  // 5: Pill capsule
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  ),
  // 6: DNA strand
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 10.5C7.8 13.8 10.2 15 12 15s4.2-1.2 7.5-4.5" />
      <path d="M19.5 13.5C16.2 10.2 13.8 9 12 9s-4.2 1.2-7.5 4.5" />
      <circle cx="6" cy="12" r="0.5" fill="currentColor" />
      <circle cx="9" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="15" cy="13.5" r="0.5" fill="currentColor" />
      <circle cx="18" cy="12" r="0.5" fill="currentColor" />
    </svg>
  ),
  // 7: Hospital
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
      <path d="M10 9h4M12 7v4" />
    </svg>
  ),
  // 8: Health plus symbol (boxed)
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  // 9: Medical document
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  // 10: Leaf (wellness)
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z" />
      <path d="M9 22c0-3 2-6 8-10" />
    </svg>
  ),
  // 11: Water drop
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
    </svg>
  ),
  // 12: First aid kit
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 10v6M9 13h6" />
    </svg>
  ),
];

// Predefined positions and variables to prevent hydration issues
const LAYER_1: FloatingItem[] = [
  { id: "l1-1", x: 8, y: 12, scale: 0.95, rotation: 12, iconIndex: 0, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "" },
  { id: "l1-2", x: 28, y: 8, scale: 1.1, rotation: -25, iconIndex: 1, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "hidden md:block" },
  { id: "l1-3", x: 48, y: 15, scale: 0.9, rotation: 30, iconIndex: 2, opacity: 0.03, animationClass: "animate-drift-layer-1", visibilityClass: "hidden lg:block" },
  { id: "l1-4", x: 72, y: 7, scale: 1.05, rotation: -15, iconIndex: 3, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "hidden md:block" },
  { id: "l1-5", x: 92, y: 18, scale: 1.0, rotation: 40, iconIndex: 4, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "" },
  { id: "l1-6", x: 15, y: 45, scale: 1.15, rotation: -10, iconIndex: 5, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "hidden md:block" },
  { id: "l1-7", x: 38, y: 35, scale: 0.9, rotation: 15, iconIndex: 6, opacity: 0.03, animationClass: "animate-drift-layer-1", visibilityClass: "hidden lg:block" },
  { id: "l1-8", x: 62, y: 48, scale: 1.05, rotation: -35, iconIndex: 7, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "hidden lg:block" },
  { id: "l1-9", x: 82, y: 40, scale: 0.95, rotation: 20, iconIndex: 8, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "" },
  { id: "l1-10", x: 7, y: 75, scale: 1.0, rotation: 5, iconIndex: 9, opacity: 0.03, animationClass: "animate-drift-layer-1", visibilityClass: "hidden md:block" },
  { id: "l1-11", x: 25, y: 88, scale: 1.1, rotation: -40, iconIndex: 10, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "" },
  { id: "l1-12", x: 50, y: 80, scale: 0.95, rotation: 25, iconIndex: 11, opacity: 0.03, animationClass: "animate-drift-layer-1", visibilityClass: "hidden lg:block" },
  { id: "l1-13", x: 75, y: 85, scale: 1.05, rotation: -18, iconIndex: 12, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "hidden md:block" },
  { id: "l1-14", x: 93, y: 72, scale: 0.9, rotation: 35, iconIndex: 0, opacity: 0.04, animationClass: "animate-drift-layer-1", visibilityClass: "" },
];

const LAYER_2: FloatingItem[] = [
  { id: "l2-1", x: 18, y: 22, scale: 1.0, rotation: -18, iconIndex: 7, opacity: 0.06, animationClass: "animate-drift-layer-2", visibilityClass: "" },
  { id: "l2-2", x: 40, y: 5, scale: 0.85, rotation: 10, iconIndex: 9, opacity: 0.05, animationClass: "animate-drift-layer-2", visibilityClass: "hidden lg:block" },
  { id: "l2-3", x: 60, y: 20, scale: 1.1, rotation: -30, iconIndex: 10, opacity: 0.06, animationClass: "animate-drift-layer-2", visibilityClass: "hidden md:block" },
  { id: "l2-4", x: 80, y: 15, scale: 0.95, rotation: 15, iconIndex: 12, opacity: 0.05, animationClass: "animate-drift-layer-2", visibilityClass: "" },
  { id: "l2-5", x: 5, y: 55, scale: 0.9, rotation: 28, iconIndex: 1, opacity: 0.05, animationClass: "animate-drift-layer-2", visibilityClass: "hidden lg:block" },
  { id: "l2-6", x: 26, y: 60, scale: 1.05, rotation: -12, iconIndex: 2, opacity: 0.06, animationClass: "animate-drift-layer-2", visibilityClass: "" },
  { id: "l2-7", x: 48, y: 52, scale: 0.95, rotation: 8, iconIndex: 3, opacity: 0.05, animationClass: "animate-drift-layer-2", visibilityClass: "hidden lg:block" },
  { id: "l2-8", x: 70, y: 65, scale: 1.0, rotation: -22, iconIndex: 5, opacity: 0.06, animationClass: "animate-drift-layer-2", visibilityClass: "hidden md:block" },
  { id: "l2-9", x: 90, y: 50, scale: 1.1, rotation: 32, iconIndex: 6, opacity: 0.06, animationClass: "animate-drift-layer-2", visibilityClass: "" },
  { id: "l2-10", x: 12, y: 92, scale: 0.95, rotation: -5, iconIndex: 11, opacity: 0.05, animationClass: "animate-drift-layer-2", visibilityClass: "hidden md:block" },
  { id: "l2-11", x: 35, y: 78, scale: 1.0, rotation: 18, iconIndex: 4, opacity: 0.06, animationClass: "animate-drift-layer-2", visibilityClass: "" },
  { id: "l2-12", x: 62, y: 90, scale: 0.9, rotation: -15, iconIndex: 8, opacity: 0.05, animationClass: "animate-drift-layer-2", visibilityClass: "hidden lg:block" },
  { id: "l2-13", x: 88, y: 88, scale: 1.05, rotation: 25, iconIndex: 1, opacity: 0.06, animationClass: "animate-drift-layer-2", visibilityClass: "hidden md:block" },
];

const LAYER_3: FloatingItem[] = [
  { id: "dot-1", x: 5, y: 15, scale: 0.6, rotation: 0, opacity: 0.12, animationClass: "animate-drift-layer-3", visibilityClass: "" },
  { id: "dot-2", x: 22, y: 32, scale: 0.8, rotation: 0, opacity: 0.10, animationClass: "animate-drift-layer-3", visibilityClass: "hidden md:block" },
  { id: "dot-3", x: 34, y: 18, scale: 0.5, rotation: 0, opacity: 0.08, animationClass: "animate-drift-layer-3", visibilityClass: "hidden lg:block" },
  { id: "dot-4", x: 55, y: 8, scale: 0.7, rotation: 0, opacity: 0.11, animationClass: "animate-drift-layer-3", visibilityClass: "hidden md:block" },
  { id: "dot-5", x: 68, y: 25, scale: 0.6, rotation: 0, opacity: 0.10, animationClass: "animate-drift-layer-3", visibilityClass: "" },
  { id: "dot-6", x: 85, y: 32, scale: 0.7, rotation: 0, opacity: 0.12, animationClass: "animate-drift-layer-3", visibilityClass: "hidden lg:block" },
  { id: "dot-7", x: 12, y: 50, scale: 0.5, rotation: 0, opacity: 0.08, animationClass: "animate-drift-layer-3", visibilityClass: "hidden lg:block" },
  { id: "dot-8", x: 29, y: 42, scale: 0.7, rotation: 0, opacity: 0.11, animationClass: "animate-drift-layer-3", visibilityClass: "" },
  { id: "dot-9", x: 52, y: 38, scale: 0.6, rotation: 0, opacity: 0.10, animationClass: "animate-drift-layer-3", visibilityClass: "hidden md:block" },
  { id: "dot-10", x: 74, y: 52, scale: 0.8, rotation: 0, opacity: 0.12, animationClass: "animate-drift-layer-3", visibilityClass: "hidden lg:block" },
  { id: "dot-11", x: 94, y: 45, scale: 0.5, rotation: 0, opacity: 0.09, animationClass: "animate-drift-layer-3", visibilityClass: "" },
  { id: "dot-12", x: 17, y: 68, scale: 0.7, rotation: 0, opacity: 0.10, animationClass: "animate-drift-layer-3", visibilityClass: "hidden md:block" },
  { id: "dot-13", x: 42, y: 72, scale: 0.6, rotation: 0, opacity: 0.09, animationClass: "animate-drift-layer-3", visibilityClass: "hidden lg:block" },
  { id: "dot-14", x: 65, y: 78, scale: 0.8, rotation: 0, opacity: 0.12, animationClass: "animate-drift-layer-3", visibilityClass: "" },
  { id: "dot-15", x: 81, y: 62, scale: 0.5, rotation: 0, opacity: 0.08, animationClass: "animate-drift-layer-3", visibilityClass: "hidden lg:block" },
  { id: "dot-16", x: 47, y: 95, scale: 0.7, rotation: 0, opacity: 0.11, animationClass: "animate-drift-layer-3", visibilityClass: "hidden md:block" },
];

export function FloatingMedicalPattern() {
  useEffect(() => {
    // Select elements that handle the mouse movement shift
    const elements = document.querySelectorAll<HTMLDivElement>("[data-floating-icon]");
    
    // Store their initial center coordinates based on bounding client rect
    const iconData = Array.from(elements).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        initialX: rect.left + rect.width / 2,
        initialY: rect.top + rect.height / 2,
      };
    });

    // Recalculate baseline center coordinates on resize
    const handleResize = () => {
      iconData.forEach((data) => {
        const prevTransform = data.el.style.transform;
        // Temporarily reset style to measure clean bounding box coordinates
        data.el.style.transform = "";
        const rect = data.el.getBoundingClientRect();
        data.initialX = rect.left + rect.width / 2;
        data.initialY = rect.top + rect.height / 2;
        data.el.style.transform = prevTransform;
      });
    };

    // Global cursor tracking to subtly translate close icons
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      iconData.forEach((data) => {
        const dx = data.initialX - mouseX;
        const dy = data.initialY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const threshold = 160; // radius of interactive influence in pixels

        if (dist < threshold) {
          const maxShift = 4.5; // maximum displacement 3-5px
          const factor = (threshold - dist) / threshold; // 0 to 1 scaling
          const shift = factor * maxShift;

          // Compute directional vector away from cursor
          const angle = Math.atan2(dy, dx);
          const shiftX = Math.cos(angle) * shift;
          const shiftY = Math.sin(angle) * shift;

          // Double containment: Outer element receives mouse displacement,
          // Inner child retains GPU drift keyframes.
          data.el.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
        } else {
          data.el.style.transform = "translate3d(0px, 0px, 0px)";
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Initial measurement
    handleResize();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10">
      {/* Layer 1: Lowest opacity, slow drifting, large spacing */}
      {LAYER_1.map((item) => {
        const IconComponent = item.iconIndex !== undefined ? ICONS[item.iconIndex] : null;
        if (!IconComponent) return null;
        return (
          <div
            key={item.id}
            data-floating-icon
            className={`absolute pointer-events-none select-none transition-transform duration-300 ease-out ${item.visibilityClass}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              opacity: item.opacity,
              willChange: "transform",
            }}
          >
            <div 
              className={item.animationClass}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
              }}
            >
              <IconComponent className="w-5 h-5 text-sky-600/80" strokeWidth={1.2} />
            </div>
          </div>
        );
      })}

      {/* Layer 2: Slightly higher opacity, medium drifting */}
      {LAYER_2.map((item) => {
        const IconComponent = item.iconIndex !== undefined ? ICONS[item.iconIndex] : null;
        if (!IconComponent) return null;
        return (
          <div
            key={item.id}
            data-floating-icon
            className={`absolute pointer-events-none select-none transition-transform duration-300 ease-out ${item.visibilityClass}`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              opacity: item.opacity,
              willChange: "transform",
            }}
          >
            <div 
              className={item.animationClass}
              style={{
                transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
              }}
            >
              <IconComponent className="w-[18px] h-[18px] text-teal-600/80" strokeWidth={1.2} />
            </div>
          </div>
        );
      })}

      {/* Layer 3: Soft glowing dots / tiny floating particles */}
      {LAYER_3.map((item) => (
        <div
          key={item.id}
          data-floating-icon
          className={`absolute pointer-events-none select-none transition-transform duration-300 ease-out ${item.visibilityClass}`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity,
            willChange: "transform",
          }}
        >
          <div 
            className={item.animationClass}
            style={{
              transform: `scale(${item.scale})`,
            }}
          >
            <div className="w-[5px] h-[5px] rounded-full bg-emerald-400/80 blur-[0.5px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
