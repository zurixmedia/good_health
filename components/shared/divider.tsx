"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  vertical?: boolean;
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingClasses = {
  none: "",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
};

/**
 * Divider
 * Visual separator between content sections
 */
export function Divider({
  className,
  vertical = false,
  spacing = "md",
}: DividerProps) {
  return (
    <div
      className={cn(
        vertical
          ? cn("h-full w-px bg-gray-200", "mx-4")
          : cn("w-full h-px bg-gray-200", spacingClasses[spacing]),
        className,
      )}
      role="separator"
      aria-orientation={vertical ? "vertical" : "horizontal"}
    />
  );
}
