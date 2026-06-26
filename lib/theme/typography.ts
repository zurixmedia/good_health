/**
 * GoodHealth Typography System
 *
 * Primary font: Inter
 * Ensures accessibility and readability across all devices.
 */

export const typography = {
  fontFamily: {
    primary:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  // Heading Scales
  heading: {
    h1: {
      fontSize: "2.25rem", // 36px
      lineHeight: "2.5rem", // 40px
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "1.875rem", // 30px
      lineHeight: "2.25rem", // 36px
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "1.5rem", // 24px
      lineHeight: "2rem", // 32px
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontSize: "1.25rem", // 20px
      lineHeight: "1.75rem", // 28px
      fontWeight: 600,
      letterSpacing: "0em",
    },
    h5: {
      fontSize: "1.125rem", // 18px
      lineHeight: "1.75rem", // 28px
      fontWeight: 600,
      letterSpacing: "0em",
    },
    h6: {
      fontSize: "1rem", // 16px
      lineHeight: "1.5rem", // 24px
      fontWeight: 600,
      letterSpacing: "0em",
    },
  },

  // Body Text
  body: {
    lg: {
      fontSize: "1.125rem", // 18px
      lineHeight: "1.75rem", // 28px
      fontWeight: 400,
    },
    base: {
      fontSize: "1rem", // 16px
      lineHeight: "1.5rem", // 24px
      fontWeight: 400,
    },
    sm: {
      fontSize: "0.875rem", // 14px
      lineHeight: "1.25rem", // 20px
      fontWeight: 400,
    },
    xs: {
      fontSize: "0.75rem", // 12px
      lineHeight: "1rem", // 16px
      fontWeight: 400,
    },
  },

  // Caption and Small Text
  caption: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1rem", // 16px
    fontWeight: 500,
  },

  // Label
  label: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.25rem", // 20px
    fontWeight: 500,
  },

  // Button Text
  button: {
    lg: {
      fontSize: "1rem", // 16px
      fontWeight: 600,
    },
    base: {
      fontSize: "0.875rem", // 14px
      fontWeight: 600,
    },
    sm: {
      fontSize: "0.75rem", // 12px
      fontWeight: 600,
    },
  },
} as const;

export type TypographyToken = typeof typography;
