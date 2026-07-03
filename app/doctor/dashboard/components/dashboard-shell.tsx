"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Doctor nav items ────────────────────────────────────────────────────────
const navItems = [
  {
    href: "/doctor/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/doctor/appointments",
    label: "Appointments",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/doctor/availability",
    label: "Availability",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: "/doctor/consultations",
    label: "Consultations",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },
  {
    href: "/doctor/membership",
    label: "Membership",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    href: "/doctor/profile",
    label: "Profile",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    href: "/doctor/medical-history",
    label: "Patient Records",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="13" x2="12" y2="17" />
        <line x1="10" y1="15" x2="14" y2="15" />
      </svg>
    ),
  },
  {
    href: "/doctor/notifications",
    label: "Notifications",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    href: "/doctor/settings",
    label: "Settings",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

type DashboardShellProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
  };
  children: React.ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className="flex min-h-screen bg-[#faf9f7]">
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-[260px] lg:fixed lg:inset-y-0 lg:left-0 bg-white border-r border-[#eeece8] z-30"
        aria-label="Doctor sidebar navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#eeece8]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2641FF]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-[#1a1a1a] tracking-tight">
            GoodHealth
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`doctor-sidebar-nav-${item.label.toLowerCase()}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-[#eef0ff] text-[#2641FF] font-semibold"
                    : "text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]"
                )}
              >
                <span
                  className={cn(active ? "text-[#2641FF]" : "text-[#9b9b9b]")}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile at bottom */}
        <div className="p-4 border-t border-[#eeece8]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2641FF]/10 text-[#2641FF] text-sm font-bold flex-shrink-0 overflow-hidden">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                Dr. {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-[#9b9b9b] truncate">{user.email}</p>
            </div>
            <Link
              href="/sign-out"
              id="doctor-sidebar-sign-out-btn"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eeece8] text-[#9b9b9b] hover:text-[#1a1a1a] transition-colors"
              title="Sign out"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-[#eeece8] flex items-center justify-between px-4 h-14">
        <button
          id="doctor-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg text-[#6b6b6b] hover:bg-[#f5f5f5] transition-colors"
          aria-label="Open navigation menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2641FF]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base font-bold text-[#1a1a1a]">GoodHealth</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#2641FF]/10 text-[#2641FF] text-xs font-bold flex items-center justify-center overflow-hidden">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.firstName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative z-10 flex flex-col w-[260px] bg-white h-full shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#eeece8]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2641FF]">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-bold text-[#1a1a1a]">GoodHealth</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-[#9b9b9b] hover:text-[#1a1a1a]"
                aria-label="Close menu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-[#eef0ff] text-[#2641FF] font-semibold"
                        : "text-[#6b6b6b] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]"
                    )}
                  >
                    <span
                      className={cn(
                        active ? "text-[#2641FF]" : "text-[#9b9b9b]"
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-[260px]">
        {/* Top bar (desktop) */}
        <div className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-[#eeece8] bg-white sticky top-0 z-20">
          <h1 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
            Doctor Dashboard
          </h1>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <Link
              href="/doctor/dashboard#notifications"
              id="doctor-topbar-notifications-link"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#eeece8] bg-white text-[#6b6b6b] hover:bg-[#f5f5f5] transition-colors"
              aria-label="Notifications"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </Link>
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-[#2641FF]/10 text-[#2641FF] text-sm font-bold flex items-center justify-center overflow-hidden border border-[#eeece8]">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.firstName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main
          className="px-4 py-6 lg:px-8 lg:py-8 mt-14 lg:mt-0"
          id="doctor-dashboard-main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
