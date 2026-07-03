"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import { cn, formatDate } from "@/lib/utils";
import type { ConsultationSummary } from "./actions";

type Props = {
  consultations: ConsultationSummary[];
  user: PatientUser;
};

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  ACTIVE: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Live Now" },
  SCHEDULED: { bg: "bg-blue-50 text-blue-700 border-blue-200", label: "Scheduled" },
  COMPLETED: { bg: "bg-gray-100 text-gray-700 border-gray-200", label: "Completed" },
  MISSED: { bg: "bg-amber-50 text-amber-700 border-amber-200", label: "Missed" },
};

export function ConsultationsClient({ consultations, user }: Props) {
  const [selectedId, setSelectedId] = useState<string>(consultations[0]?.id ?? "");

  const selectedConsultation = consultations.find((c) => c.id === selectedId) ?? consultations[0];

  const metrics = {
    active: consultations.filter((c) => c.status === "ACTIVE").length,
    scheduled: consultations.filter((c) => c.status === "SCHEDULED").length,
    completed: consultations.filter((c) => c.status === "COMPLETED").length,
  };

  return (
    <PatientShellClient user={user} title="Video Consultations">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Video Consultations</h1>
        <p className="text-sm text-[#6b6b6b]">Join secure rooms, view recordings, and access clinical notes.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Live Rooms", value: metrics.active, color: "text-emerald-600 bg-emerald-50" },
          { label: "Scheduled", value: metrics.scheduled, color: "text-[#2641FF] bg-[#eef0ff]" },
          { label: "Completed Sessions", value: metrics.completed, color: "text-purple-600 bg-purple-50" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#eeece8] bg-white p-5">
            <span className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">{item.label}</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#1a1a1a]">{item.value}</span>
              <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", item.color)}>Active</span>
            </div>
          </div>
        ))}
      </div>

      {consultations.length === 0 ? (
        <div className="rounded-2xl border border-[#eeece8] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f7]">
            <svg className="h-6 w-6 text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <p className="text-base font-bold text-[#1a1a1a]">No consultations found</p>
          <p className="text-xs text-[#6b6b6b] mt-1 mb-6">Schedule a virtual consultation to start video calls.</p>
          <Link
            href="/patient/doctors"
            className="rounded-full bg-[#2641FF] px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#2641FF]/10 transition hover:bg-[#1a30e8]"
          >
            Find a Practitioner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Main List */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#1a1a1a]">Consultation Queue</h2>
            {consultations.map((item) => {
              const active = selectedId === item.id;
              const status = STATUS_STYLES[item.status] ?? STATUS_STYLES.SCHEDULED;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border bg-white p-5 transition hover:shadow-md",
                    active ? "border-[#2641FF] ring-2 ring-[#2641FF]/10" : "border-[#eeece8]",
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#1a1a1a]">{item.doctorName}</span>
                        <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", status.bg)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6b6b6b]">
                        {item.specialty ?? "General Practice"} consultation • {formatDate(item.appointmentDate, "long")} at {formatDate(item.appointmentStartTime, "time")}
                      </p>
                      <p className="text-xs text-[#9b9b9b] line-clamp-1">{item.reasonForVisit}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                      <span className="text-[9px] font-bold text-[#9b9b9b] border border-[#eeece8] rounded-full px-2 py-0.5 bg-[#faf9f7]">
                        {item.meetingProvider}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {selectedConsultation ? (
              <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-6">
                <div className="border-b border-[#eeece8] pb-4">
                  <h3 className="text-sm font-bold text-[#1a1a1a]">Session Preview</h3>
                  <p className="text-[10px] text-[#6b6b6b] mt-0.5">Quick summaries & active links.</p>
                </div>

                <div className="space-y-4 text-xs text-[#1a1a1a]">
                  <div>
                    <span className="text-[#9b9b9b] uppercase tracking-wide font-semibold text-[9px]">Doctor</span>
                    <p className="font-bold text-sm mt-0.5">{selectedConsultation.doctorName}</p>
                  </div>
                  <div>
                    <span className="text-[#9b9b9b] uppercase tracking-wide font-semibold text-[9px]">Reason for Visit</span>
                    <p className="text-[#6b6b6b] mt-0.5">{selectedConsultation.reasonForVisit}</p>
                  </div>
                  {selectedConsultation.diagnosis && (
                    <div>
                      <span className="text-[#9b9b9b] uppercase tracking-wide font-semibold text-[9px]">Diagnosis</span>
                      <p className="text-[#6b6b6b] mt-0.5">{selectedConsultation.diagnosis}</p>
                    </div>
                  )}
                  {selectedConsultation.recommendations && (
                    <div>
                      <span className="text-[#9b9b9b] uppercase tracking-wide font-semibold text-[9px]">Recommendations</span>
                      <p className="text-[#6b6b6b] mt-0.5">{selectedConsultation.recommendations}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#eeece8]">
                  {(selectedConsultation.status === "SCHEDULED" || selectedConsultation.status === "ACTIVE") ? (
                    <Link
                      href={`/patient/consultations/${selectedConsultation.id}`}
                      className="w-full text-center rounded-full bg-[#2641FF] py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#2641FF]/10 transition hover:bg-[#1a30e8]"
                    >
                      Open Video Room
                    </Link>
                  ) : (
                    <Link
                      href={`/patient/consultations/${selectedConsultation.id}`}
                      className="w-full text-center rounded-full border border-[#eeece8] py-2.5 text-xs font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition"
                    >
                      View Summary
                    </Link>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </PatientShellClient>
  );
}
