/**
 * GoodHealth Color System
 *
 * Follows the UI/UX guidelines with healthcare-focused colors
 * that inspire trust and clarity.
 */

export const colors = {
  // Brand Colors
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Healthcare Blue
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c3d66",
    950: "#051e3e",
  },
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Healthcare Green
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#145231",
    950: "#052e16",
  },

  // Semantic Colors
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#0ea5e9",

  // Neutral Colors
  white: "#ffffff",
  black: "#000000",

  // Gray Scale
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Semantic Background Colors
  background: {
    primary: "#ffffff",
    secondary: "#f9fafb",
    tertiary: "#f3f4f6",
  },

  // Text Colors
  text: {
    primary: "#111827",
    secondary: "#4b5563",
    tertiary: "#9ca3af",
    inverse: "#ffffff",
  },

  // Status Colors
  status: {
    success: "#22c55e",
    pending: "#f59e0b",
    cancelled: "#ef4444",
    completed: "#22c55e",
    confirmed: "#0ea5e9",
  },
} as const;

export type ColorToken = typeof colors;
