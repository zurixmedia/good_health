/**
 * GoodHealth Spacing System
 *
 * Uses an 8-point baseline grid for consistency.
 * All spacing values are multiples of 8.
 */

export const spacing = {
  xs: "0.5rem", // 8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "2.5rem", // 40px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "5rem", // 80px
} as const;

export const gutter = {
  xs: "0.5rem", // 8px
  sm: "1rem", // 16px
  md: "1.5rem", // 24px
  lg: "2rem", // 32px
  xl: "2.5rem", // 40px
} as const;

export const borderRadius = {
  sm: "0.375rem", // 6px
  base: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  full: "9999px",
} as const;

export type SpacingToken = typeof spacing;
export type BorderRadiusToken = typeof borderRadius;
