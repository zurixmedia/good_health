"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
};

const paddingClasses = {
  none: "",
  sm: "px-4 py-6",
  md: "px-6 py-8",
  lg: "px-8 py-12",
};

/**
 * PageContainer
 * Constrains content width and applies consistent padding
 * Used for main page content areas
 */
export function PageContainer({
  children,
  className,
  maxWidth = "xl",
  padding = "md",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container
 * Minimal wrapper for constraining content
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8", className)}
    >
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  fullWidth?: boolean;
}

/**
 * Section
 * Semantic section with vertical spacing
 */
export function Section({
  children,
  className,
  padding = true,
  fullWidth = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        "w-full",
        padding && "py-8 sm:py-12 md:py-16",
        !fullWidth && "max-w-7xl mx-auto px-4 sm:px-6 md:px-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
