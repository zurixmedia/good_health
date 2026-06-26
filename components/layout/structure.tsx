"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
  border?: boolean;
}

/**
 * Header
 * Top navigation header component
 */
export function Header({
  children,
  className,
  sticky = false,
  transparent = false,
  border = true,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "w-full bg-white",
        sticky && "sticky top-0 z-40",
        border && "border-b border-gray-200",
        !transparent && "shadow-sm",
        className,
      )}
    >
      {children}
    </header>
  );
}

interface MainProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main
 * Semantic main content area
 */
export function Main({ children, className }: MainProps) {
  return <main className={cn("flex-1 w-full", className)}>{children}</main>;
}

interface FooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Footer
 * Page footer component
 */
export function Footer({ children, className }: FooterProps) {
  return (
    <footer
      className={cn(
        "w-full bg-gray-900 text-white border-t border-gray-800",
        className,
      )}
    >
      {children}
    </footer>
  );
}

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Layout
 * Flex layout that ensures footer sticks to bottom
 */
export function Layout({ children, className }: LayoutProps) {
  return (
    <div className={cn("flex flex-col min-h-screen w-full", className)}>
      {children}
    </div>
  );
}
