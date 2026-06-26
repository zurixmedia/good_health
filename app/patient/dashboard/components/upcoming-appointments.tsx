"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";

type Appointment = {
  id: string;
  hospitalName: string;
  hospitalLocation: string;
  hospitalPhone: string | null;
  doctorName: string;
  appointmentDate: Date;
  appointmentStartTime: Date;
  appointmentStatus: string;
  appointmentType: string;
};

type UpcomingAppointmentsProps = {
  appointments: Appointment[];
};

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date));
}

/**
 * UpcomingAppointments
 * Renders a table (desktop) / card list (mobile) of upcoming appointments.
 * Empty state matches Figma "First time User" design.
 */
export function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-[#eeece8] bg-white overflow-hidden">
        {/* Table header always visible */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] bg-[#d8dcff] px-6 py-3.5 text-sm font-semibold text-[#3d3d3d]">
          <span>Hospital Name</span>
          <span>Phone Number</span>
          <span>Date</span>
          <span>Time</span>
          <span>Action</span>
        </div>
        {/* Empty illustration */}
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <EmptyIllustration />
          <h3 className="mt-6 text-xl font-bold text-[#1a1a1a]">
            You have no upcoming appointments yet!
          </h3>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Would you like to book an appointment?
          </p>
          <Link
            href="/patient/appointments"
            id="empty-state-book-now"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#2641FF] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#1a30e8] active:scale-95"
          >
            Book Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] bg-[#d8dcff] px-6 py-3.5 text-sm font-semibold text-[#3d3d3d]">
          <span>Hospital Name</span>
          <span>Phone Number</span>
          <span>Date</span>
          <span>Time</span>
          <span>Action</span>
        </div>
        {/* Data rows */}
        {appointments.map((apt, i) => (
          <div
            key={apt.id}
            className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.2fr] items-center px-6 py-4 border-t border-[#eeece8] hover:bg-[#faf9f7] transition-colors"
          >
            {/* Hospital */}
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-[#e8e8e8] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#1a1a1a] truncate max-w-[180px]">
                  {apt.hospitalName}
                </p>
                <p className="text-xs font-semibold text-[#c0114e]">
                  {apt.hospitalLocation}
                </p>
              </div>
            </div>
            {/* Phone */}
            <span className="text-sm font-semibold text-[#1a1a1a]">
              {apt.hospitalPhone ?? "—"}
            </span>
            {/* Date */}
            <span className="text-sm text-[#1a1a1a]">
              {formatShortDate(apt.appointmentDate)}
            </span>
            {/* Time */}
            <span className="text-sm text-[#1a1a1a]">
              {formatTime(apt.appointmentStartTime)}
            </span>
            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href={`/patient/appointments?reschedule=${apt.id}`}
                id={`reschedule-apt-${apt.id}`}
                className="text-sm font-semibold text-[#2641FF] hover:underline transition-colors"
              >
                Reschedule
              </Link>
              <Link
                href={`/patient/appointments?cancel=${apt.id}`}
                id={`cancel-apt-${apt.id}`}
                className="text-sm font-semibold text-[#e53e3e] hover:underline transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-[#eeece8]">
        {appointments.map((apt) => (
          <div key={apt.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {apt.hospitalName}
                </p>
                <p className="text-xs font-semibold text-[#c0114e]">
                  {apt.hospitalLocation}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  apt.appointmentStatus === "CONFIRMED"
                    ? "bg-[#d1fae5] text-[#065f46]"
                    : "bg-[#fef9c3] text-[#854d0e]"
                }`}
              >
                {apt.appointmentStatus}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-[#6b6b6b]">
              <span>📅 {formatShortDate(apt.appointmentDate)}</span>
              <span>🕐 {formatTime(apt.appointmentStartTime)}</span>
            </div>
            {apt.hospitalPhone && (
              <p className="text-xs text-[#6b6b6b]">
                📞 {apt.hospitalPhone}
              </p>
            )}
            <div className="flex gap-4 pt-1">
              <Link
                href={`/patient/appointments?reschedule=${apt.id}`}
                id={`mobile-reschedule-apt-${apt.id}`}
                className="text-sm font-semibold text-[#2641FF] hover:underline"
              >
                Reschedule
              </Link>
              <Link
                href={`/patient/appointments?cancel=${apt.id}`}
                id={`mobile-cancel-apt-${apt.id}`}
                className="text-sm font-semibold text-[#e53e3e] hover:underline"
              >
                Cancel
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inline SVG illustration for empty state ─────────────────────────────────
function EmptyIllustration() {
  return (
    <svg
      width="200"
      height="160"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Monitor */}
      <rect x="40" y="20" width="120" height="90" rx="8" fill="#e8e8e8" />
      <rect x="48" y="28" width="104" height="74" rx="4" fill="#f5f5f5" />
      {/* Stand */}
      <rect x="88" y="110" width="24" height="16" rx="2" fill="#d0d0d0" />
      <rect x="72" y="124" width="56" height="6" rx="3" fill="#d0d0d0" />
      {/* Screen content – magnifier */}
      <circle cx="92" cy="65" r="18" fill="white" stroke="#d8dcff" strokeWidth="3" />
      <line x1="104" y1="77" x2="116" y2="89" stroke="#d8dcff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="92" cy="65" r="8" fill="#d8dcff" opacity="0.5" />
      {/* Plant */}
      <rect x="148" y="100" width="10" height="22" rx="2" fill="#8b5e3c" />
      <ellipse cx="153" cy="88" rx="12" ry="14" fill="#6cb67a" />
      <ellipse cx="145" cy="94" rx="8" ry="10" fill="#4caf50" />
      <ellipse cx="161" cy="96" rx="8" ry="10" fill="#4caf50" />
      {/* Person */}
      <circle cx="52" cy="72" r="10" fill="#f5cba7" />
      <path d="M38 110 Q52 90 66 110" fill="#2641FF" />
      {/* Cursor */}
      <polygon points="95,55 100,70 103,63 110,66" fill="#1a1a1a" opacity="0.6" />
    </svg>
  );
}
