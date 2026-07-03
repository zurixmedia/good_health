"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { DashboardShell } from "@/app/doctor/dashboard/components/dashboard-shell";
import {
  updateAppointmentStatus,
  type DoctorAppointment,
} from "./actions";
import { AppointmentStatus } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMED: { label: "Confirmed", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  COMPLETED: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-50 text-red-700 border-red-200" },
  NO_SHOW: { label: "No Show", cls: "bg-gray-100 text-gray-600 border-gray-200" },
};

function StatusBadge({ status }: { status: string }) {
  const e = STATUS_MAP[status] ?? { label: status, cls: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", e.cls)}>
      {e.label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
      type === "VIRTUAL"
        ? "bg-indigo-50 text-indigo-700"
        : "bg-orange-50 text-orange-700",
    )}>
      {type === "VIRTUAL" ? "🎥" : "🏥"} {type === "VIRTUAL" ? "Virtual" : "Physical"}
    </span>
  );
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(d));
}

function calcAge(dob: Date | null): string {
  if (!dob) return "—";
  const diff = Date.now() - new Date(dob).getTime();
  return `${Math.floor(diff / (365.25 * 24 * 3600 * 1000))} yrs`;
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

type ModalProps = {
  apt: DoctorAppointment;
  onClose: () => void;
  onAction: (id: string, status: AppointmentStatus) => Promise<void>;
  isPending: boolean;
};

function AppointmentModal({ apt, onClose, onAction, isPending }: ModalProps) {
  const canConfirm = apt.appointmentStatus === "PENDING";
  const canComplete = apt.appointmentStatus === "CONFIRMED";
  const canCancel = ["PENDING", "CONFIRMED"].includes(apt.appointmentStatus);
  const canNoShow = apt.appointmentStatus === "CONFIRMED";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eeece8]">
          <div>
            <h2 className="text-lg font-bold text-[#1a1a1a]">{apt.patientName}</h2>
            <p className="text-xs text-[#9b9b9b]">Appointment Details</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={apt.appointmentStatus} />
            <button
              onClick={onClose}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-[#9b9b9b] hover:bg-[#f5f5f5] transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-5 space-y-5">
          {/* Appointment info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Date", value: formatDate(apt.appointmentDate) },
              { label: "Time", value: `${formatTime(apt.appointmentStartTime)} – ${formatTime(apt.appointmentEndTime)}` },
              { label: "Type", value: <TypeBadge type={apt.appointmentType} /> },
              { label: "Venue", value: apt.hospitalName ?? "Virtual / TBD" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-4 py-3">
                <p className="text-xs text-[#9b9b9b] mb-1">{label}</p>
                <div className="text-sm font-semibold text-[#1a1a1a]">{value}</div>
              </div>
            ))}
          </div>

          {/* Patient info */}
          <div>
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">Patient Information</h3>
            <div className="flex items-center gap-3 rounded-xl bg-[#faf9f7] border border-[#eeece8] p-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-sm font-bold text-[#2641FF]">
                {apt.patientInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1a1a1a]">{apt.patientName}</p>
                <p className="text-xs text-[#9b9b9b]">{apt.patientEmail}</p>
                {apt.patientPhone && (
                  <p className="text-xs text-[#9b9b9b]">{apt.patientPhone}</p>
                )}
              </div>
              <div className="text-right text-xs text-[#9b9b9b] space-y-1">
                {apt.patientGender && <p>{apt.patientGender}</p>}
                {apt.patientBloodGroup && (
                  <p className="font-semibold text-red-600">{apt.patientBloodGroup}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">Reason for Visit</h3>
            <p className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-4 py-3 text-sm text-[#1a1a1a]">
              {apt.reasonForVisit}
            </p>
          </div>

          {apt.notes && (
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">Patient Notes</h3>
              <p className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-[#1a1a1a]">
                {apt.notes}
              </p>
            </div>
          )}

          {/* Virtual call CTA */}
          {apt.appointmentType === "VIRTUAL" && apt.consultationUrl && (
            <Link
              href={apt.consultationUrl}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              🎥 Join Video Call
            </Link>
          )}
          {apt.appointmentType === "VIRTUAL" && apt.consultationId && !apt.consultationUrl && (
            <Link
              href={`/doctor/consultations/${apt.consultationId}`}
              className="flex items-center justify-center gap-2 w-full rounded-full border border-indigo-600 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
              🎥 Open Consultation Room
            </Link>
          )}
        </div>

        {/* Actions footer */}
        {(canConfirm || canComplete || canCancel || canNoShow) && (
          <div className="border-t border-[#eeece8] px-6 py-4 flex flex-wrap gap-2 justify-end">
            {canCancel && (
              <button
                onClick={() => onAction(apt.id, AppointmentStatus.CANCELLED)}
                disabled={isPending}
                className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                Decline / Cancel
              </button>
            )}
            {canNoShow && (
              <button
                onClick={() => onAction(apt.id, AppointmentStatus.NO_SHOW)}
                disabled={isPending}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Mark No-Show
              </button>
            )}
            {canConfirm && (
              <button
                onClick={() => onAction(apt.id, AppointmentStatus.CONFIRMED)}
                disabled={isPending}
                className="rounded-full bg-[#2641FF] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1a30e8] disabled:opacity-50"
              >
                {isPending ? "Processing…" : "✓ Accept"}
              </button>
            )}
            {canComplete && (
              <button
                onClick={() => onAction(apt.id, AppointmentStatus.COMPLETED)}
                disabled={isPending}
                className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {isPending ? "Processing…" : "✓ Mark Completed"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Filter = "all" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

type Props = {
  appointments: DoctorAppointment[];
  user: { firstName: string; lastName: string; email: string; profileImageUrl: string | null };
};

export function AppointmentsPageClient({ appointments: initial, user }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<DoctorAppointment | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesFilter = filter === "all" || apt.appointmentStatus === filter;
      const matchesSearch = search
        ? apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
          apt.reasonForVisit.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [appointments, filter, search]);

  const counts = useMemo(
    () => ({
      all: appointments.length,
      PENDING: appointments.filter((a) => a.appointmentStatus === "PENDING").length,
      CONFIRMED: appointments.filter((a) => a.appointmentStatus === "CONFIRMED").length,
      COMPLETED: appointments.filter((a) => a.appointmentStatus === "COMPLETED").length,
      CANCELLED: appointments.filter((a) => a.appointmentStatus === "CANCELLED").length,
    }),
    [appointments],
  );

  async function handleAction(id: string, status: AppointmentStatus) {
    startTransition(async () => {
      const result = await updateAppointmentStatus(id, status);
      if (result.success) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, appointmentStatus: status } : a,
          ),
        );
        setSelected((prev) =>
          prev?.id === id ? { ...prev, appointmentStatus: status } : prev,
        );
        setToast({ type: "success", msg: "Appointment updated!" });
      } else {
        setToast({ type: "error", msg: result.error ?? "Failed to update" });
      }
      setTimeout(() => setToast(null), 3500);
    });
  }

  const filterTabs: { key: Filter; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "PENDING", label: `Pending (${counts.PENDING})` },
    { key: "CONFIRMED", label: `Confirmed (${counts.CONFIRMED})` },
    { key: "COMPLETED", label: `Completed (${counts.COMPLETED})` },
    { key: "CANCELLED", label: `Cancelled (${counts.CANCELLED})` },
  ];

  return (
    <DashboardShell user={user}>
      {/* Toast */}
      {toast && (
        <div className={cn("fixed top-5 right-5 z-50 rounded-2xl px-5 py-4 text-sm font-semibold shadow-xl",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <AppointmentModal
          apt={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
          isPending={isPending}
        />
      )}

      {/* Page header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Appointments</h1>
        <p className="text-sm text-[#6b6b6b]">Manage and track all your patient appointments.</p>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.all, color: "bg-[#eef0ff] text-[#2641FF]" },
          { label: "Pending", value: counts.PENDING, color: "bg-amber-50 text-amber-700" },
          { label: "Confirmed", value: counts.CONFIRMED, color: "bg-sky-50 text-sky-700" },
          { label: "Completed", value: counts.COMPLETED, color: "bg-emerald-50 text-emerald-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl border border-[#eeece8] bg-white p-5">
            <p className="text-xs text-[#9b9b9b]">{label}</p>
            <p className={cn("text-3xl font-extrabold mt-1", color.split(" ")[1])}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name or reason…"
            className="w-full rounded-xl border border-[#eeece8] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex-shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition",
                filter === key
                  ? "border-[#2641FF] bg-[#2641FF] text-white"
                  : "border-[#eeece8] bg-white text-[#6b6b6b] hover:border-[#2641FF]/40",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#eeece8] bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf9f7]">
            <svg className="h-8 w-8 text-[#d1d5db]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-base font-semibold text-[#1a1a1a]">No appointments found</p>
          <p className="text-sm text-[#9b9b9b] mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <button
              key={apt.id}
              onClick={() => setSelected(apt)}
              className="group w-full rounded-2xl border border-[#eeece8] bg-white p-5 text-left transition hover:border-[#2641FF]/30 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                {/* Initials */}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-sm font-bold text-[#2641FF]">
                  {apt.patientInitials}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-[#1a1a1a]">{apt.patientName}</p>
                    <StatusBadge status={apt.appointmentStatus} />
                    <TypeBadge type={apt.appointmentType} />
                  </div>
                  <p className="text-sm text-[#6b6b6b] truncate">{apt.reasonForVisit}</p>
                  <p className="text-xs text-[#9b9b9b] mt-1">
                    {formatDate(apt.appointmentDate)} · {formatTime(apt.appointmentStartTime)}
                    {apt.hospitalName && ` · ${apt.hospitalName}`}
                  </p>
                </div>

                {/* Arrow */}
                <svg className="h-4 w-4 flex-shrink-0 text-[#d1d5db] transition group-hover:text-[#2641FF] group-hover:translate-x-0.5 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
