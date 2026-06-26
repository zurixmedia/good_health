"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/shared";

type PastAppointment = {
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

type AppointmentHistoryProps = {
  appointments: PastAppointment[];
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

// Map database/retrieved doctor name to the app's query param doctorId
function getDoctorQueryId(doctorName: string): string {
  const normalized = doctorName.toLowerCase();
  if (normalized.includes("amara") || normalized.includes("bello")) {
    return "dr-amara-bello";
  }
  if (normalized.includes("noah") || normalized.includes("stein")) {
    return "dr-noah-stein";
  }
  if (normalized.includes("lina") || normalized.includes("park")) {
    return "dr-lina-park";
  }
  if (normalized.includes("ibrahim") || normalized.includes("adele")) {
    return "dr-ibrahim-adele";
  }
  return "";
}

export function AppointmentHistory({ appointments }: AppointmentHistoryProps) {
  // Store expanded appointment IDs
  const [expandedAptId, setExpandedAptId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedAptId(expandedAptId === id ? null : id);
  };

  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-[#eeece8] bg-white p-8 text-center">
        <p className="text-sm text-[#9b9b9b]">No consultation history found.</p>
        <Link
          href="/patient/appointments"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#2641FF] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a30e8] active:scale-95"
        >
          Book Your First Appointment
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        {/* Header Row */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] bg-[#d8dcff] px-6 py-3.5 text-sm font-semibold text-[#3d3d3d]">
          <span>Doctor / Provider</span>
          <span>Location</span>
          <span>Date</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {appointments.map((apt) => {
          const isExpanded = expandedAptId === apt.id;
          const docQueryId = getDoctorQueryId(apt.doctorName);
          const bookAgainUrl = docQueryId
            ? `/patient/appointments?doctor=${docQueryId}`
            : "/patient/appointments";

          // Determine status badge variant
          let statusVariant: "success" | "error" | "warning" | "default" = "default";
          if (apt.appointmentStatus === "COMPLETED") statusVariant = "success";
          else if (apt.appointmentStatus === "CANCELLED") statusVariant = "error";
          else if (apt.appointmentStatus === "NO_SHOW") statusVariant = "warning";

          return (
            <div key={apt.id} className="border-t border-[#eeece8]">
              {/* Main row info */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] items-center px-6 py-4 hover:bg-[#faf9f7] transition-colors">
                {/* Doctor profile info */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#eef0ff] text-[#2641FF] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {apt.doctorName.replace("Dr. ", "").charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">
                      {apt.doctorName}
                    </p>
                    <p className="text-xs text-[#6b6b6b]">
                      {apt.appointmentType === "VIRTUAL" ? "Video Consultation" : "In-Person Visit"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a] truncate max-w-[160px]">
                    {apt.hospitalName}
                  </p>
                  <p className="text-xs font-semibold text-[#c0114e]">
                    {apt.hospitalLocation}
                  </p>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-sm text-[#1a1a1a]">
                    {formatShortDate(apt.appointmentDate)}
                  </p>
                  <p className="text-xs text-[#6b6b6b]">
                    {formatTime(apt.appointmentStartTime)}
                  </p>
                </div>

                {/* Status Badge */}
                <div>
                  <Badge variant={statusVariant} size="sm" className="capitalize">
                    {apt.appointmentStatus.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => toggleExpand(apt.id)}
                    className="text-sm font-semibold text-[#2641FF] hover:underline"
                  >
                    {isExpanded ? "Hide details" : "View details"}
                  </button>
                  <Link
                    href={bookAgainUrl}
                    className="text-sm font-semibold text-[#6b6b6b] hover:text-[#2641FF] hover:underline"
                  >
                    Book Again
                  </Link>
                </div>
              </div>

              {/* Expandable detailed drawer/row */}
              {isExpanded && (
                <div className="bg-[#fcfbf9] px-6 py-4 border-t border-[#eeece8] text-sm text-[#3d3d3d] space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#9b9b9b] mb-1">
                        Reason for Visit
                      </h5>
                      <p className="text-[#1a1a1a]">
                        Routine follow-up consultation and health assessment.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#9b9b9b] mb-1">
                        Doctor Notes / Summary
                      </h5>
                      <p className="text-[#1a1a1a] italic">
                        "Patient is responding well to treatment. Recommended continuation of current vitamins and routine physical exercise. Follow up in 3 months or if any symptoms arise."
                      </p>
                    </div>
                  </div>
                  {apt.hospitalPhone && (
                    <div className="pt-2 border-t border-[#eeece8] text-xs text-[#6b6b6b] flex gap-2">
                      <span className="font-semibold">Clinic Contact:</span>
                      <span>{apt.hospitalPhone}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-[#eeece8]">
        {appointments.map((apt) => {
          const isExpanded = expandedAptId === apt.id;
          const docQueryId = getDoctorQueryId(apt.doctorName);
          const bookAgainUrl = docQueryId
            ? `/patient/appointments?doctor=${docQueryId}`
            : "/patient/appointments";

          let statusVariant: "success" | "error" | "warning" | "default" = "default";
          if (apt.appointmentStatus === "COMPLETED") statusVariant = "success";
          else if (apt.appointmentStatus === "CANCELLED") statusVariant = "error";
          else if (apt.appointmentStatus === "NO_SHOW") statusVariant = "warning";

          return (
            <div key={apt.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-[#1a1a1a]">
                    {apt.doctorName}
                  </h4>
                  <p className="text-xs text-[#6b6b6b]">
                    {apt.appointmentType === "VIRTUAL" ? "Video Consultation" : "In-Person Visit"}
                  </p>
                </div>
                <Badge variant={statusVariant} size="sm" className="capitalize">
                  {apt.appointmentStatus.toLowerCase().replace("_", " ")}
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-[#6b6b6b]">
                <p>📍 {apt.hospitalName} ({apt.hospitalLocation})</p>
                <p>📅 {formatShortDate(apt.appointmentDate)} at {formatTime(apt.appointmentStartTime)}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#f0eee9] text-sm">
                <button
                  onClick={() => toggleExpand(apt.id)}
                  className="font-semibold text-[#2641FF]"
                >
                  {isExpanded ? "Hide notes" : "View notes"}
                </button>
                <Link
                  href={bookAgainUrl}
                  className="font-semibold text-[#6b6b6b] hover:text-[#2641FF]"
                >
                  Book Again
                </Link>
              </div>

              {isExpanded && (
                <div className="bg-[#faf9f7] rounded-xl p-3 text-xs text-[#3d3d3d] space-y-2 border border-[#eeece8]">
                  <div>
                    <span className="font-bold text-[#6b6b6b] block mb-0.5">REASON FOR VISIT</span>
                    <p className="text-[#1a1a1a]">Routine follow-up consultation.</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#6b6b6b] block mb-0.5">DOCTOR'S SUMMARY</span>
                    <p className="text-[#1a1a1a] italic">
                      "Patient is doing well. Continue current therapy. Next checkup recommended in 3 months."
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
