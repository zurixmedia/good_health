"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  logo?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Navbar
 * Main navigation bar component
 */
export function Navbar({ logo, children, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-4 sm:px-6 md:px-8 py-4",
        "bg-white border-b border-gray-200",
        className,
      )}
    >
      {logo && <div className="flex-shrink-0">{logo}</div>}
      {children && (
        <div className="flex-1 flex items-center justify-end gap-8">
          {children}
        </div>
      )}
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
  external?: boolean;
}

/**
 * NavLink
 * Navigation link with active state indicator
 */
export function NavLink({
  href,
  children,
  active,
  className,
  external = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : pathname === href;

  const LinkComponent = external ? "a" : Link;
  const linkProps = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <LinkComponent
      {...linkProps}
      className={cn(
        "text-sm font-medium transition-colors duration-200",
        "text-gray-600 hover:text-gray-900",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1",
        isActive && "text-blue-600 border-b-2 border-blue-600 pb-3",
        className,
      )}
    >
      {children}
    </LinkComponent>
  );
}

interface NavItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * NavItem
 * Container for navigation items
 */
export function NavItem({ children, className }: NavItemProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>{children}</div>
  );
}

interface NavGroupProps {
  children: ReactNode;
  className?: string;
}

/**
 * NavGroup
 * Groups navigation items together
 */
export function NavGroup({ children, className }: NavGroupProps) {
  return (
    <div className={cn("flex items-center gap-4 sm:gap-6", className)}>
      {children}
    </div>
  );
}
