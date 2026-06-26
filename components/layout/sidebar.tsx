"use client";

import React, { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
  collapsible?: boolean;
}

/**
 * Sidebar
 * Side navigation component
 */
export function Sidebar({
  children,
  className,
  side = "left",
  collapsible = false,
}: SidebarProps) {
  const [isOpen] = useState(true);

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-gray-200",
        side === "right" && "border-r-0 border-l",
        !isOpen && collapsible && "hidden",
        className,
      )}
    >
      {children}
    </aside>
  );
}

interface SidebarContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * SidebarContent
 * Container for sidebar content
 */
export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn("flex flex-col h-full overflow-y-auto", className)}>
      {children}
    </div>
  );
}

interface SidebarTriggerProps {
  onClick?: () => void;
  className?: string;
}

/**
 * SidebarTrigger
 * Button to toggle sidebar visibility
 */
export function SidebarTrigger({ onClick, className }: SidebarTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
        "h-10 w-10",
        className,
      )}
      aria-label="Toggle sidebar"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
