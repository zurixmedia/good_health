"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";
  size?: "sm" | "md";
  outlined?: boolean;
}

const variantClasses = {
  default: "bg-gray-100 text-gray-900",
  primary: "bg-blue-100 text-blue-900",
  secondary: "bg-green-100 text-green-900",
  success: "bg-green-100 text-green-900",
  warning: "bg-amber-100 text-amber-900",
  error: "bg-red-100 text-red-900",
  info: "bg-blue-100 text-blue-900",
};

const outlinedVariantClasses = {
  default: "border border-gray-300 text-gray-900",
  primary: "border border-blue-300 text-blue-900",
  secondary: "border border-green-300 text-green-900",
  success: "border border-green-300 text-green-900",
  warning: "border border-amber-300 text-amber-900",
  error: "border border-red-300 text-red-900",
  info: "border border-blue-300 text-blue-900",
};

const sizeClasses = {
  sm: "px-2 py-1 text-xs font-medium rounded",
  md: "px-3 py-1.5 text-sm font-medium rounded-md",
};

/**
 * Badge
 * Small label for tagging and status indication
 */
export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  outlined = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold",
        sizeClasses[size],
        outlined ? outlinedVariantClasses[variant] : variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: "pending" | "confirmed" | "completed" | "cancelled";
  className?: string;
  size?: "sm" | "md";
}

/**
 * StatusBadge
 * Healthcare status indicator badge
 */
export function StatusBadge({
  status,
  className,
  size = "md",
}: StatusBadgeProps) {
  const statusVariant = {
    pending: "warning",
    confirmed: "primary",
    completed: "success",
    cancelled: "error",
  } as const;

  const statusLabel = {
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <Badge variant={statusVariant[status]} size={size} className={className}>
      {statusLabel[status]}
    </Badge>
  );
}
