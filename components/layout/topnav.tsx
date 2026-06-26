"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TopNavProps {
  children: ReactNode;
  className?: string;
}

/**
 * TopNav
 * Top navigation bar wrapper
 */
export function TopNav({ children, className }: TopNavProps) {
  return (
    <nav className={cn("flex items-center justify-between w-full", className)}>
      {children}
    </nav>
  );
}

interface TopNavContentProps {
  children: ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}

/**
 * TopNavContent
 * Container for grouped navigation content
 */
export function TopNavContent({
  children,
  className,
  align = "start",
}: TopNavContentProps) {
  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  return (
    <div
      className={cn("flex items-center gap-4", alignClasses[align], className)}
    >
      {children}
    </div>
  );
}
