"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import { cn, formatDate } from "@/lib/utils";
import { DailyCallView } from "@/components/consultations/daily-call-view";
import type { ConsultationSummary } from "../actions";

type Props = {
  consultation: ConsultationSummary;
  user: PatientUser;
};

type Phase = "room" | "ended" | "completed";

export function ConsultationRoomClient({ consultation, user }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("room");

  const statusVariantClass =
    consultation.status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : consultation.status === "COMPLETED"
        ? "bg-gray-100 text-gray-700 border-gray-200"
        : "bg-blue-50 text-blue-700 border-blue-200";

  const statusLabel =
    consultation.status === "ACTIVE"
      ? "Live now"
      : consultation.status === "COMPLETED"
        ? "Consultation completed"
        : "Waiting room";

  const handleCompleted = () => {
    setPhase("completed");
  };

  const handleLeft = () => {
    setPhase("ended");
  };

  const handleBack = () => {
    router.push("/patient/consultations");
  };

  return (
    <PatientShellClient user={user} title="Secure Video Room">
      {/* Header card info */}
      <div className="mb-8 rounded-2xl border border-[#eeece8] bg-white p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-[#1a1a1a]">{consultation.doctorName}</span>
              <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border", statusVariantClass)}>
                {statusLabel}
              </span>
            </div>
            <p className="text-xs text-[#6b6b6b]">
              {consultation.specialty ?? "General"} consultation for {consultation.patientName}.
            </p>
            <p className="text-xs text-[#9b9b9b]">
              Scheduled: {formatDate(consultation.appointmentDate, "long")} at {formatDate(consultation.appointmentStartTime, "time")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start sm:self-auto">
            <span className="text-[9px] font-bold text-[#9b9b9b] border border-[#eeece8] rounded-full px-2 py-0.5 bg-[#faf9f7]">
              {consultation.meetingProvider}
            </span>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 text-xs">
          <div className="rounded-xl border border-[#eeece8] bg-[#faf9f7] p-3 text-center">
            <span className="block text-[9px] font-bold text-[#9b9b9b] uppercase">Appointment</span>
            <span className="block font-semibold text-[#1a1a1a] mt-0.5">#{consultation.appointmentId.slice(0, 8)}</span>
          </div>
          <div className="rounded-xl border border-[#eeece8] bg-[#faf9f7] p-3 text-center">
            <span className="block text-[9px] font-bold text-[#9b9b9b] uppercase">Format</span>
            <span className="block font-semibold text-[#1a1a1a] mt-0.5">Video Call</span>
          </div>
          <div className="rounded-xl border border-[#eeece8] bg-[#faf9f7] p-3 text-center">
            <span className="block text-[9px] font-bold text-[#9b9b9b] uppercase">Patient</span>
            <span className="block font-semibold text-[#1a1a1a] mt-0.5 truncate">{consultation.patientName}</span>
          </div>
          <div className="rounded-xl border border-[#eeece8] bg-[#faf9f7] p-3 text-center">
            <span className="block text-[9px] font-bold text-[#9b9b9b] uppercase">Access</span>
            <span className="block font-semibold text-[#1a1a1a] mt-0.5">Assigned Only</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Call screen & clinical summary */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Call screen side */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#1a1a1a]">Secure Call Stream</h2>

          <div className="overflow-hidden rounded-2xl border border-[#eeece8] bg-black aspect-video relative shadow-inner">
            {phase === "completed" ? (
              <div className="absolute inset-0 bg-[#faf9f7] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#1a1a1a]">Consultation Session Completed</h3>
                <p className="text-xs text-[#6b6b6b] max-w-sm">
                  The clinical consultation has ended. Your physician has recorded diagnosis and follow-up directives.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleBack}
                    className="rounded-full bg-[#2641FF] px-6 py-2 text-xs font-semibold text-white shadow-md shadow-[#2641FF]/10 transition hover:bg-[#1a30e8]"
                  >
                    Back to Queue
                  </button>
                  <Link
                    href="/patient/appointments"
                    className="rounded-full border border-[#eeece8] bg-white px-6 py-2 text-xs font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition"
                  >
                    Schedule Follow-up
                  </Link>
                </div>
              </div>
            ) : phase === "ended" ? (
              <div className="absolute inset-0 bg-[#faf9f7] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <h3 className="text-base font-bold text-[#1a1a1a]">You Left the Call</h3>
                <p className="text-xs text-[#6b6b6b]">
                  You can rejoin the call as long as the doctor is active in the room.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPhase("room")}
                    className="rounded-full bg-[#2641FF] px-6 py-2 text-xs font-semibold text-white shadow-md shadow-[#2641FF]/10 transition hover:bg-[#1a30e8]"
                  >
                    Rejoin Room
                  </button>
                  <button
                    onClick={handleBack}
                    className="rounded-full border border-[#eeece8] bg-white px-6 py-2 text-xs font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition"
                  >
                    Back to Queue
                  </button>
                </div>
              </div>
            ) : (
              <DailyCallView
                consultationId={consultation.id}
                isDoctor={consultation.isDoctor}
                onCompleted={handleCompleted}
                onLeft={handleLeft}
              />
            )}
          </div>
        </div>

        {/* Notes / Clinical summary side */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-sm font-bold text-[#1a1a1a]">Consultation Summary</h2>

          <div className="rounded-2xl border border-[#eeece8] bg-white p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Reason for Visit</span>
              <p className="text-xs text-[#1a1a1a] mt-1">{consultation.reasonForVisit}</p>
            </div>
            <div className="border-t border-[#f5f5f5] pt-3">
              <span className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Diagnosis</span>
              <p className="text-xs text-[#6b6b6b] mt-1 italic">{consultation.diagnosis ?? "Waiting for doctor intake notes..."}</p>
            </div>
            <div className="border-t border-[#f5f5f5] pt-3">
              <span className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Recommendations</span>
              <p className="text-xs text-[#6b6b6b] mt-1 italic">{consultation.recommendations ?? "No prescriptions or guidelines loaded."}</p>
            </div>
            <div className="border-t border-[#f5f5f5] pt-3">
              <span className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Follow-Up Directive</span>
              <p className="text-xs text-[#6b6b6b] mt-1">
                {consultation.followUpRequired ? (consultation.followUpNotes ?? "Follow-up required.") : "No immediate clinical follow-up needed."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PatientShellClient>
  );
}
