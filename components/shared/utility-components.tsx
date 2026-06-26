"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: {
    label: "text-xs font-medium text-gray-600",
    value: "text-lg font-semibold text-gray-900",
  },
  md: {
    label: "text-sm font-medium text-gray-600",
    value: "text-2xl font-bold text-gray-900",
  },
  lg: {
    label: "text-base font-medium text-gray-600",
    value: "text-3xl font-bold text-gray-900",
  },
};

/**
 * Metric
 * Displays a key metric or statistic
 */
export function Metric({
  label,
  value,
  unit,
  icon,
  className,
  size = "md",
}: MetricProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-lg bg-white border border-gray-200",
        className,
      )}
    >
      {icon && <div className="text-blue-600">{icon}</div>}
      <div className={sizeClasses[size].label}>{label}</div>
      <div className="flex items-baseline gap-1">
        <div className={sizeClasses[size].value}>{value}</div>
        {unit && <span className="text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: ReactNode;
  className?: string;
  direction?: "row" | "col";
}

/**
 * InfoItem
 * Displays a labeled information item
 */
export function InfoItem({
  label,
  value,
  className,
  direction = "row",
}: InfoItemProps) {
  return (
    <div
      className={cn(
        "flex gap-2",
        direction === "col" ? "flex-col" : "justify-between items-start",
        className,
      )}
    >
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * EmptyState
 * Displayed when no content is available
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-gray-400 text-5xl">{icon}</div>}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
