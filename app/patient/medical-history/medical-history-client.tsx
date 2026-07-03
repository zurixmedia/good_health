"use client";

import React, { useState, useMemo } from "react";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import type { MedicalHistoryAppointment, MedicalHistoryData } from "./actions";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Completed" },
  CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Confirmed" },
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Cancelled" },
  NO_SHOW: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: "No Show" },
};

const FILTER_TABS = ["All", "Completed", "Upcoming", "Cancelled"] as const;

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type Props = {
  initialData: MedicalHistoryData;
  user: PatientUser;
};

export function MedicalHistoryClient({ initialData, user }: Props) {
  const { appointments, totalVisits, doctorsCount, lastVisitDate } = initialData;

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_TABS)[number]>("All");
  const [selected, setSelected] = useState<MedicalHistoryAppointment | null>(null);

  const filtered = useMemo(() => {
    let list = appointments;

    // Filter by tab
    if (activeFilter === "Completed") {
      list = list.filter((a) => a.appointmentStatus === "COMPLETED");
    } else if (activeFilter === "Upcoming") {
      list = list.filter((a) => a.appointmentStatus === "CONFIRMED" || a.appointmentStatus === "PENDING");
    } else if (activeFilter === "Cancelled") {
      list = list.filter((a) => a.appointmentStatus === "CANCELLED" || a.appointmentStatus === "NO_SHOW");
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.doctorName.toLowerCase().includes(q) ||
          a.hospitalName.toLowerCase().includes(q) ||
          a.reasonForVisit.toLowerCase().includes(q) ||
          (a.specialization && a.specialization.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [appointments, activeFilter, search]);

  return (
    <PatientShellClient user={user} title="Medical History">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Medical History</h1>
        <p className="text-sm text-[#6b6b6b]">View your past visits, diagnoses, and health records.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        {[
          {
            label: "Total Visits",
            value: totalVisits,
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            ),
            color: "text-[#2641FF] bg-[#eef0ff]",
          },
          {
            label: "Doctors Seen",
            value: doctorsCount,
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ),
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Last Visit",
            value: lastVisitDate ? fmt(lastVisitDate) : "N/A",
            icon: (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
            color: "text-purple-600 bg-purple-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#eeece8] bg-white p-5 flex items-center gap-4">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold text-[#1a1a1a]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs + search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl bg-[#f5f5f5] p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition",
                activeFilter === tab ? "bg-white text-[#1a1a1a] shadow-sm" : "text-[#6b6b6b] hover:text-[#1a1a1a]",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search records…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72 rounded-xl border border-[#eeece8] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1a1a1a] outline-none placeholder:text-[#b0b0b0] focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10 transition"
          />
        </div>
      </div>

      {/* Records list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-[#eeece8] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f5]">
              <svg className="h-7 w-7 text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-[#1a1a1a]">No records found</p>
            <p className="mt-1 text-sm text-[#6b6b6b]">
              {search ? "Try a different search term." : "Your medical history will appear here after your first visit."}
            </p>
          </div>
        ) : (
          filtered.map((apt) => {
            const status = STATUS_STYLES[apt.appointmentStatus] ?? STATUS_STYLES.PENDING;
            const isSelected = selected?.id === apt.id;

            return (
              <button
                key={apt.id}
                onClick={() => setSelected(isSelected ? null : apt)}
                className={cn(
                  "w-full text-left rounded-2xl border bg-white p-5 transition hover:shadow-md",
                  isSelected ? "border-[#2641FF] ring-2 ring-[#2641FF]/10" : "border-[#eeece8]",
                )}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Doctor avatar */}
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-sm font-bold text-[#2641FF]">
                      {apt.doctorName.split(" ").slice(1).map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#1a1a1a]">{apt.doctorName}</span>
                        {apt.specialization && (
                          <span className="text-xs text-[#6b6b6b] bg-[#f5f5f5] rounded-full px-2 py-0.5">{apt.specialization}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#9b9b9b] mt-0.5">{apt.hospitalName}</p>
                      <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-1">{apt.reasonForVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                    <span className="text-xs font-semibold text-[#6b6b6b]">{fmt(apt.appointmentDate)}</span>
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", status.bg, status.text)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                      {status.label}
                    </span>
                    <span className="text-[10px] text-[#b0b0b0] capitalize">
                      {apt.appointmentType.replace("_", " ").toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div className="mt-4 border-t border-[#eeece8] pt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <DetailBlock label="Reason for Visit" value={apt.reasonForVisit} />
                      {apt.notes && <DetailBlock label="Doctor Notes" value={apt.notes} />}
                    </div>

                    {apt.consultation && (
                      <div className="rounded-xl border border-[#eef0ff] bg-[#fafaff] p-4 space-y-3">
                        <h4 className="text-sm font-bold text-[#2641FF]">Consultation Details</h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {apt.consultation.symptoms && <DetailBlock label="Symptoms" value={apt.consultation.symptoms} />}
                          {apt.consultation.diagnosis && <DetailBlock label="Diagnosis" value={apt.consultation.diagnosis} />}
                          {apt.consultation.recommendations && <DetailBlock label="Recommendations" value={apt.consultation.recommendations} />}
                          {apt.consultation.followUpRequired && (
                            <DetailBlock
                              label="Follow-up"
                              value={apt.consultation.followUpNotes ?? "Follow-up required"}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </PatientShellClient>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#9b9b9b] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-[#1a1a1a]">{value}</p>
    </div>
  );
}
