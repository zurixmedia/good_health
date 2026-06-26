"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

// Headings

interface H1Props extends TypographyProps {
  as?: "h1" | "h2" | "h3";
}

export function H1({ children, className, as: Component = "h1" }: H1Props) {
  return (
    <Component
      className={cn(
        "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900",
        className,
      )}
    >
      {children}
    </Component>
  );
}

interface H2Props extends TypographyProps {
  as?: "h2" | "h3" | "h4";
}

export function H2({ children, className, as: Component = "h2" }: H2Props) {
  return (
    <Component
      className={cn(
        "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900",
        className,
      )}
    >
      {children}
    </Component>
  );
}

interface H3Props extends TypographyProps {
  as?: "h3" | "h4" | "h5";
}

export function H3({ children, className, as: Component = "h3" }: H3Props) {
  return (
    <Component
      className={cn(
        "text-xl sm:text-2xl md:text-3xl font-bold text-gray-900",
        className,
      )}
    >
      {children}
    </Component>
  );
}

interface H4Props extends TypographyProps {
  as?: "h4" | "h5" | "h6";
}

export function H4({ children, className, as: Component = "h4" }: H4Props) {
  return (
    <Component
      className={cn(
        "text-lg sm:text-xl font-semibold text-gray-900",
        className,
      )}
    >
      {children}
    </Component>
  );
}

// Body Text

interface BodyProps extends TypographyProps {
  size?: "sm" | "base" | "lg";
  muted?: boolean;
  as?: "p" | "div" | "span";
}

export function Body({
  children,
  className,
  size = "base",
  muted = false,
  as: Component = "p",
}: BodyProps) {
  const sizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    lg: "text-lg leading-relaxed",
  };

  return (
    <Component
      className={cn(
        sizeClasses[size],
        muted ? "text-gray-600" : "text-gray-900",
        className,
      )}
    >
      {children}
    </Component>
  );
}

interface TextProps extends TypographyProps {
  muted?: boolean;
}

export function Text({ children, className, muted = false }: TextProps) {
  return (
    <span
      className={cn(
        "text-sm",
        muted ? "text-gray-600" : "text-gray-900",
        className,
      )}
    >
      {children}
    </span>
  );
}

// Label

interface LabelProps extends TypographyProps {
  htmlFor?: string;
  required?: boolean;
}

export function Label({
  children,
  className,
  htmlFor,
  required = false,
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-sm font-medium text-gray-900 block", className)}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

// Caption

export function Caption({ children, className }: TypographyProps) {
  return (
    <small className={cn("text-xs text-gray-600", className)}>{children}</small>
  );
}

// Muted Text

export function Muted({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-sm text-gray-600", className)}>{children}</span>
  );
}
