"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: "sm" | "md" | "lg";
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

const gapClasses = {
  sm: "gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
};

/**
 * Grid
 * Responsive grid layout
 */
export function Grid({
  children,
  className,
  columns = 3,
  gap = "md",
}: GridProps) {
  return (
    <div
      className={cn("grid", columnClasses[columns], gapClasses[gap], className)}
    >
      {children}
    </div>
  );
}

interface FlexProps {
  children: ReactNode;
  className?: string;
  direction?: "row" | "col";
  justify?: "start" | "center" | "between" | "end";
  align?: "start" | "center" | "end" | "stretch";
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
}

const directionClasses = {
  row: "flex-row",
  col: "flex-col",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  between: "justify-between",
  end: "justify-end",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const gapClasses2 = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

/**
 * Flex
 * Flexible layout component
 */
export function Flex({
  children,
  className,
  direction = "row",
  justify = "start",
  align = "center",
  gap = "md",
  wrap = false,
}: FlexProps) {
  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        gapClasses2[gap],
        wrap && "flex-wrap",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface StackProps {
  children: ReactNode;
  className?: string;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
}

const spacingClasses2 = {
  xs: "space-y-2",
  sm: "space-y-3",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
};

/**
 * Stack
 * Vertical stack with consistent spacing
 */
export function Stack({ children, className, spacing = "md" }: StackProps) {
  return (
    <div className={cn("flex flex-col", spacingClasses2[spacing], className)}>
      {children}
    </div>
  );
}

interface AspectRatioProps {
  children: ReactNode;
  className?: string;
  ratio?: number;
}

/**
 * AspectRatio
 * Maintains aspect ratio for responsive content
 */
export function AspectRatio({
  children,
  className,
  ratio = 16 / 9,
}: AspectRatioProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{
        paddingBottom: `${(1 / ratio) * 100}%`,
      }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
