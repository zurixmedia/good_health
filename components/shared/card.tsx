"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

/**
 * Card
 * Container for grouped content
 */
export function Card({
  children,
  className,
  hoverable = false,
  bordered = true,
  padding = "md",
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-white rounded-lg",
        bordered && "border border-gray-200",
        hoverable &&
          "hover:shadow-md hover:border-gray-300 transition-all duration-200",
        !hoverable && "shadow-sm",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardHeader
 * Header section of a card
 */
export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("pb-4 border-b border-gray-100", className)}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardBody
 * Body section of a card
 */
export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn("py-4", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardFooter
 * Footer section of a card
 */
export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("pt-4 border-t border-gray-100", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "base" | "lg";
}

/**
 * CardTitle
 * Title for card content
 */
export function CardTitle({
  children,
  className,
  as: Component = "h3",
  size = "base",
}: CardTitleProps) {
  const sizeClasses = {
    sm: "text-sm font-semibold",
    base: "text-base font-semibold md:text-lg",
    lg: "text-lg font-bold md:text-xl",
  };

  return (
    <Component className={cn(sizeClasses[size], "text-gray-900", className)}>
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardDescription
 * Description text for card
 */
export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn("text-sm text-gray-600", className)}>{children}</p>;
}
