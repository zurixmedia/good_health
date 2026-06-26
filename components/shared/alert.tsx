"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  children: ReactNode;
  className?: string;
  variant?: "info" | "success" | "warning" | "error";
}

const variantClasses = {
  info: "bg-blue-50 border-blue-200 text-blue-900",
  success: "bg-green-50 border-green-200 text-green-900",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  error: "bg-red-50 border-red-200 text-red-900",
};

const iconClasses = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-amber-500",
  error: "text-red-500",
};

/**
 * Alert
 * Contextual alert message component
 */
export function Alert({ children, className, variant = "info" }: AlertProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        variantClasses[variant],
        className,
      )}
      role="alert"
    >
      <div className={cn("flex-shrink-0 h-5 w-5 mt-0.5", iconClasses[variant])}>
        {variant === "info" && (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {variant === "success" && (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {variant === "warning" && (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {variant === "error" && (
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface AlertTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * AlertTitle
 * Title for alert message
 */
export function AlertTitle({ children, className }: AlertTitleProps) {
  return <h3 className={cn("font-semibold text-sm", className)}>{children}</h3>;
}

interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
}

/**
 * AlertDescription
 * Description text for alert
 */
export function AlertDescription({
  children,
  className,
}: AlertDescriptionProps) {
  return <p className={cn("text-sm mt-1", className)}>{children}</p>;
}
