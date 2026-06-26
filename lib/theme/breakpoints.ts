/**
 * GoodHealth Responsive Breakpoints
 *
 * Mobile-first responsive design breakpoints
 */

export const breakpoints = {
  xs: "0px", // Mobile
  sm: "640px", // Tablet
  md: "768px", // Small Laptop
  lg: "1024px", // Laptop
  xl: "1280px", // Desktop
  "2xl": "1536px", // Large Desktop
} as const;

export const containerWidths = {
  xs: "100%",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1400px",
} as const;

export type BreakpointKey = keyof typeof breakpoints;
