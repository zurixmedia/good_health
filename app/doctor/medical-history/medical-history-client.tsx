"use client";

import React, { useState, useMemo, useTransition } from "react";
import { DashboardShell } from "@/app/doctor/dashboard/components/dashboard-shell";
import {
  addClinicalNote,
  type PatientRecord,
} from "./actions";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}

function calcAge(dob: Date | null): string {
  if (!dob) return "—";
  const diff = Date.now() - new Date(dob).getTime();
  return `${Math.floor(diff / (365.25 * 24 * 3600 * 1000))} yrs`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CONFIRMED: "bg-sky-50 text-sky-700 border-sky-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    NO_SHOW: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", map[status] ?? "bg-gray-100 text-gray-500 border-gray-200")}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ─── Clinical Note Modal ──────────────────────────────────────────────────────

function ClinicalNoteModal({
  appointmentId,
  existingNote,
  onClose,
  onSaved,
}: {
  appointmentId: string;
  existingNote: {
    symptoms: string | null;
    diagnosis: string | null;
    recommendations: string | null;
    followUpRequired: boolean;
    followUpNotes: string | null;
  } | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [symptoms, setSymptoms] = useState(existingNote?.symptoms ?? "");
  const [diagnosis, setDiagnosis] = useState(existingNote?.diagnosis ?? "");
  const [recommendations, setRecommendations] = useState(existingNote?.recommendations ?? "");
  const [followUpRequired, setFollowUpRequired] = useState(existingNote?.followUpRequired ?? false);
  const [followUpNotes, setFollowUpNotes] = useState(existingNote?.followUpNotes ?? "");
  const [toast, setToast] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addClinicalNote({ appointmentId, symptoms, diagnosis, recommendations, followUpRequired, followUpNotes });
      if (result.success) {
        onSaved();
        onClose();
      } else {
        setToast(result.error ?? "Failed to save note.");
      }
    });
  }

  const ta = (value: string, onChange: (v: string) => void, placeholder: string) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#b0b0b0] outline-none focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10 resize-none"
    />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eeece8]">
          <h2 className="text-base font-bold text-[#1a1a1a]">Clinical Notes</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full text-[#9b9b9b] hover:bg-[#f5f5f5]">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh] px-6 py-5 space-y-4">
          {toast && <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{toast}</p>}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1a1a1a]">Presenting Symptoms</label>
            {ta(symptoms, setSymptoms, "Describe patient's symptoms…")}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1a1a1a]">Diagnosis</label>
            {ta(diagnosis, setDiagnosis, "Enter diagnosis…")}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1a1a1a]">Recommendations / Prescriptions</label>
            {ta(recommendations, setRecommendations, "Medications, lifestyle advice…")}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#eeece8] bg-[#faf9f7] px-4 py-3">
            <label className="text-sm font-semibold text-[#1a1a1a]">Follow-up Required</label>
            <button
              type="button"
              role="switch"
              aria-checked={followUpRequired}
              onClick={() => setFollowUpRequired(!followUpRequired)}
              className={cn("relative flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors", followUpRequired ? "bg-[#2641FF]" : "bg-[#d1d5db]")}
            >
              <span className={cn("absolute h-4 w-4 rounded-full bg-white shadow transition-transform", followUpRequired ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>
          {followUpRequired && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1a1a1a]">Follow-up Instructions</label>
              {ta(followUpNotes, setFollowUpNotes, "Follow-up timeline and instructions…")}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2 pb-2">
            <button type="button" onClick={onClose} className="rounded-full border border-[#eeece8] px-5 py-2.5 text-sm font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition">Cancel</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 rounded-full bg-[#2641FF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 hover:bg-[#1a30e8] transition disabled:opacity-60">
              {isPending ? "Saving…" : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Patient Detail Panel ─────────────────────────────────────────────────────

function PatientDetailPanel({
  record,
  onClose,
  onNoteAdded,
}: {
  record: PatientRecord;
  onClose: () => void;
  onNoteAdded: () => void;
}) {
  const [noteModal, setNoteModal] = useState<{
    appointmentId: string;
    existingNote: {
      symptoms: string | null;
      diagnosis: string | null;
      recommendations: string | null;
      followUpRequired: boolean;
      followUpNotes: string | null;
    } | null;
  } | null>(null);

  return (
    <>
      {noteModal && (
        <ClinicalNoteModal
          appointmentId={noteModal.appointmentId}
          existingNote={noteModal.existingNote}
          onClose={() => setNoteModal(null)}
          onSaved={onNoteAdded}
        />
      )}

      <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-[#eeece8] flex-shrink-0">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-lg font-extrabold text-[#2641FF]">
              {record.patientInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1a1a1a] truncate">{record.patientName}</p>
              <p className="text-xs text-[#9b9b9b] truncate">{record.patientEmail}</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full text-[#9b9b9b] hover:bg-[#f5f5f5]">✕</button>
          </div>

          {/* Patient meta */}
          <div className="grid grid-cols-3 gap-3 px-6 py-4 border-b border-[#eeece8] flex-shrink-0">
            {[
              { label: "Age", value: calcAge(record.patientDateOfBirth) },
              { label: "Gender", value: record.patientGender ?? "—" },
              { label: "Blood Group", value: record.patientBloodGroup ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-3 py-2.5 text-center">
                <p className="text-xs text-[#9b9b9b]">{label}</p>
                <p className={cn("text-sm font-bold text-[#1a1a1a]", label === "Blood Group" && "text-red-600")}>{value}</p>
              </div>
            ))}
          </div>

          {/* Consultation history */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <p className="text-xs font-bold text-[#9b9b9b] uppercase tracking-wider mb-3">
              Consultation History ({record.consultations.length})
            </p>
            {record.consultations.length === 0 ? (
              <p className="text-sm text-[#9b9b9b] text-center py-8">No consultations yet.</p>
            ) : (
              <div className="space-y-3">
                {record.consultations.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-[#eeece8] bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#9b9b9b]">{formatDate(c.appointmentDate)}</p>
                      <StatusBadge status={c.appointmentStatus} />
                    </div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{c.reasonForVisit}</p>
                    {c.diagnosis && (
                      <p className="text-xs text-[#6b6b6b] mb-1"><span className="font-semibold">Dx:</span> {c.diagnosis}</p>
                    )}
                    {c.recommendations && (
                      <p className="text-xs text-[#6b6b6b] mb-1"><span className="font-semibold">Rx:</span> {c.recommendations}</p>
                    )}
                    {c.followUpRequired && (
                      <p className="text-xs text-amber-600 font-semibold">⏰ Follow-up required</p>
                    )}
                    {c.appointmentStatus === "COMPLETED" && (
                      <button
                        onClick={() => setNoteModal({ appointmentId: c.appointmentId, existingNote: c.diagnosis ? c : null })}
                        className="mt-3 w-full rounded-full border border-[#eeece8] py-2 text-xs font-semibold text-[#2641FF] hover:bg-[#eef0ff] transition"
                      >
                        {c.diagnosis ? "Edit Clinical Note" : "+ Add Clinical Note"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Props = {
  patients: PatientRecord[];
  user: { firstName: string; lastName: string; email: string; profileImageUrl: string | null };
};

export function MedicalHistoryPageClient({ patients: initial, user }: Props) {
  const [patients] = useState(initial);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PatientRecord | null>(null);

  const filtered = useMemo(() => {
    if (!search) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.patientName.toLowerCase().includes(q) ||
        p.patientEmail.toLowerCase().includes(q) ||
        (p.patientBloodGroup ?? "").toLowerCase().includes(q),
    );
  }, [patients, search]);

  return (
    <DashboardShell user={user}>
      {selected && (
        <PatientDetailPanel
          record={selected}
          onClose={() => setSelected(null)}
          onNoteAdded={() => {}}
        />
      )}

      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Patient Records</h1>
        <p className="text-sm text-[#6b6b6b]">Browse your patient database and clinical history.</p>
      </div>

      {/* Search */}
      <div className="mb-5 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients by name, email or blood group…"
          className="w-full rounded-xl border border-[#eeece8] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10"
        />
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Patients", value: patients.length },
          { label: "Total Visits", value: patients.reduce((a, p) => a + p.totalAppointments, 0) },
          { label: "Pending Follow-ups", value: patients.reduce((a, p) => a + p.consultations.filter(c => c.followUpRequired).length, 0) },
          { label: "Virtual Consultations", value: patients.reduce((a, p) => a + p.consultations.filter(c => c.appointmentType === "VIRTUAL").length, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-[#eeece8] bg-white p-5">
            <p className="text-xs text-[#9b9b9b]">{label}</p>
            <p className="text-3xl font-extrabold text-[#2641FF] mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Patients grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#eeece8] bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf9f7]">
            <svg className="h-8 w-8 text-[#d1d5db]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          </div>
          <p className="text-base font-semibold text-[#1a1a1a]">
            {search ? "No patients match your search." : "No patients yet."}
          </p>
          <p className="text-sm text-[#9b9b9b] mt-1">
            {search ? "Try a different search term." : "Patients who book with you will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <button
              key={p.patientId}
              onClick={() => setSelected(p)}
              className="group rounded-2xl border border-[#eeece8] bg-white p-5 text-left transition hover:border-[#2641FF]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-sm font-extrabold text-[#2641FF]">
                  {p.patientInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a1a1a] truncate">{p.patientName}</p>
                  <p className="text-xs text-[#9b9b9b] truncate">{p.patientEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-[#faf9f7] py-2">
                  <p className="text-xs text-[#9b9b9b]">Visits</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">{p.totalAppointments}</p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] py-2">
                  <p className="text-xs text-[#9b9b9b]">Age</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">{calcAge(p.patientDateOfBirth)}</p>
                </div>
                <div className="rounded-lg bg-[#faf9f7] py-2">
                  <p className="text-xs text-[#9b9b9b]">Blood</p>
                  <p className={cn("text-sm font-bold", p.patientBloodGroup ? "text-red-600" : "text-[#9b9b9b]")}>{p.patientBloodGroup ?? "—"}</p>
                </div>
              </div>
              {p.lastVisit && (
                <p className="mt-3 text-xs text-[#9b9b9b]">Last visit: {formatDate(p.lastVisit)}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
