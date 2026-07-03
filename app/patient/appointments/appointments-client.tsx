"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import {
  getDoctorById,
  getAvailableTimeSlots,
  createAppointment,
  type DoctorDetail,
  type TimeSlot,
  type CreateAppointmentResult,
} from "./actions";
import { cn } from "@/lib/utils";

const SLOT_LENGTH_MINUTES = 30;

const appointmentTypes = [
  {
    id: "video",
    label: "Video consultation",
    description: "Best for follow-ups, quick advice, and routine care.",
    duration: "30 min",
  },
  {
    id: "in-person",
    label: "In-person visit",
    description: "Best for physical exams, procedures, or new symptoms.",
    duration: "30 min",
  },
] as const;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildDateOptions(count = 5) {
  const base = startOfToday();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    return {
      id: date.toISOString().slice(0, 10), // yyyy-mm-dd
      date,
      relative: i === 0 ? "Today" : i === 1 ? "Tomorrow" : "Soon",
      label: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date),
    };
  });
}

const dateOptions = buildDateOptions(5);

type Props = {
  user: PatientUser;
};

export function AppointmentBookingClient({ user }: Props) {
  const searchParams = useSearchParams();
  const doctorIdFromUrl = searchParams.get("doctor");
  const typeFromUrl = searchParams.get("type");

  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [doctorLoading, setDoctorLoading] = useState(true);

  const [appointmentType, setAppointmentType] =
    useState<(typeof appointmentTypes)[number]["id"]>(
      typeFromUrl === "video" || typeFromUrl === "in-person"
        ? typeFromUrl
        : "video",
    );
  const [selectedDateId, setSelectedDateId] = useState(dateOptions[0].id);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<CreateAppointmentResult | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load the doctor selected via ?doctor=<id>.
  useEffect(() => {
    let cancelled = false;
    setDoctorLoading(true);
    (async () => {
      if (!doctorIdFromUrl) {
        setDoctor(null);
        setDoctorLoading(false);
        return;
      }
      const data = await getDoctorById(doctorIdFromUrl);
      if (!cancelled) {
        setDoctor(data);
        setDoctorLoading(false);
        // If the doctor doesn't support virtual visits, force in-person.
        if (data && !data.supportsVirtualConsultation) {
          setAppointmentType("in-person");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doctorIdFromUrl]);

  const selectedDate = useMemo(
    () => dateOptions.find((d) => d.id === selectedDateId) ?? dateOptions[0],
    [selectedDateId],
  );

  // Load time slots whenever the doctor or date changes.
  useEffect(() => {
    if (!doctor) {
      setSlots([]);
      setSelectedSlotIso(null);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSelectedSlotIso(null);
    (async () => {
      const data = await getAvailableTimeSlots(doctor.id, selectedDate.date);
      if (!cancelled) {
        setSlots(data);
        setSlotsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doctor, selectedDate]);

  const canBook =
    !!doctor &&
    !!selectedSlotIso &&
    reason.trim().length >= 3 &&
    !isPending;

  const handleConfirm = () => {
    if (!doctor || !selectedSlotIso) return;
    setResult(null);
    startTransition(async () => {
      const res = await createAppointment({
        doctorId: doctor.id,
        date: selectedDateId,
        slotIso: selectedSlotIso,
        type: appointmentType,
        reason: reason.trim(),
        notes: notes.trim(),
      });
      setResult(res);
    });
  };

  const success = result?.ok === true;

  return (
    <PatientShellClient user={user} title="Book Appointment">
      {success && result.appointment ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#eeece8] bg-white p-8 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Appointment Confirmed</h1>
            <p className="text-sm text-[#6b6b6b]">Your booking request is successfully submitted.</p>
          </div>

          <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] p-5 text-left space-y-3">
            <div>
              <p className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Doctor</p>
              <p className="text-sm font-bold text-[#1a1a1a]">{result.appointment.doctorName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Date</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(result.appointment.appointmentDate))}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Time</p>
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(result.appointment.appointmentStartTime))}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Location</p>
              <p className="text-sm text-[#1a1a1a]">
                {result.appointment.appointmentType === "VIRTUAL" ? "Secure video room (virtual)" : (doctor?.hospitalName ?? "Clinic")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/patient/dashboard"
              className="rounded-full bg-[#2641FF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 transition hover:bg-[#1a30e8]"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setSelectedSlotIso(null);
              }}
              className="rounded-full border border-[#eeece8] px-6 py-2.5 text-sm font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition"
            >
              Book Another
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Book Appointment</h1>
            <p className="text-sm text-[#6b6b6b]">Schedule care with a practitioner from your medical network.</p>
          </div>

          {result && !result.ok && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              <span className="font-bold">Could not book appointment:</span> {result.error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              {/* Step 1: Doctor Info */}
              <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-4">
                <h2 className="text-base font-bold text-[#1a1a1a]">1. Selected Practitioner</h2>
                {doctorLoading ? (
                  <p className="text-sm text-[#b0b0b0]">Loading doctor information…</p>
                ) : doctor ? (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef0ff] text-base font-bold text-[#2641FF]">
                      {doctor.name.split(" ").slice(1).map((n) => n[0]).join("")}
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-[#1a1a1a]">{doctor.name}</p>
                      <p className="text-xs text-[#6b6b6b]">{doctor.specialty ?? "General Practice"} • {doctor.hospitalName ?? "Virtual"}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-[#1a1a1a]">
                        <span>Fee: ₦{doctor.consultationFee}</span>
                        <span>•</span>
                        <span>Exp: {doctor.yearsOfExperience ? `${doctor.yearsOfExperience} yrs` : "—"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-amber-50/50 border border-amber-200 p-4 space-y-2">
                    <p className="text-sm text-amber-800">No doctor is selected for booking.</p>
                    <Link
                      href="/patient/doctors"
                      className="inline-flex text-xs font-bold text-[#2641FF] hover:underline"
                    >
                      Browse Practitioner Directory →
                    </Link>
                  </div>
                )}
              </div>

              {/* Step 2: Appointment Type */}
              <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-4">
                <h2 className="text-base font-bold text-[#1a1a1a]">2. Appointment Format</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {appointmentTypes.map((entry) => {
                    const disabled = entry.id === "video" && !!doctor && !doctor.supportsVirtualConsultation;
                    const active = appointmentType === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => setAppointmentType(entry.id)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition relative",
                          active
                            ? "border-[#2641FF] bg-[#eef0ff]/20 ring-2 ring-[#2641FF]/10"
                            : "border-[#eeece8] bg-white hover:border-[#b0b0b0]",
                          disabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#1a1a1a]">{entry.label}</span>
                          <span className="text-[10px] font-bold text-[#9b9b9b] uppercase">{entry.duration}</span>
                        </div>
                        <p className="text-xs text-[#6b6b6b] mt-1.5">{entry.description}</p>
                        {disabled && (
                          <span className="absolute top-2 right-2 text-[9px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                            Unsupported
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Date & Slots */}
              <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-6">
                <h2 className="text-base font-bold text-[#1a1a1a]">3. Schedule a Time</h2>
                
                {/* Date options */}
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-5">
                  {dateOptions.map((entry) => {
                    const active = selectedDateId === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedDateId(entry.id)}
                        className={cn(
                          "rounded-xl border p-3 text-center transition",
                          active
                            ? "border-[#2641FF] bg-[#2641FF] text-white"
                            : "border-[#eeece8] bg-white text-[#6b6b6b] hover:border-[#b0b0b0]",
                        )}
                      >
                        <span className="block text-[9px] font-bold uppercase tracking-wider opacity-85">
                          {entry.relative}
                        </span>
                        <span className="block text-xs font-semibold mt-1">
                          {entry.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Available time slots */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#1a1a1a]">Available slots</h3>
                  {slotsLoading ? (
                    <p className="text-sm text-[#b0b0b0]">Loading slots…</p>
                  ) : slots.length > 0 ? (
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                      {slots.map((slot) => {
                        const active = selectedSlotIso === slot.iso;
                        return (
                          <button
                            key={slot.iso}
                            type="button"
                            onClick={() => setSelectedSlotIso(slot.iso)}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-center text-xs font-semibold transition",
                              active
                                ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                                : "border-[#eeece8] bg-white text-[#6b6b6b] hover:border-[#b0b0b0]",
                            )}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-[#9b9b9b]">No open time slots on this day. Please try another date.</p>
                  )}
                </div>
              </div>

              {/* Step 4: Reason */}
              <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-4">
                <h2 className="text-base font-bold text-[#1a1a1a]">4. Intake Information</h2>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#1a1a1a]">
                      Reason for visit <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder="Briefly describe your symptoms or reason for booking."
                      className="w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none placeholder:text-[#b0b0b0] focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10 transition resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#1a1a1a]">
                      Extra notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      placeholder="Any medication list or past history details to share."
                      className="w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none placeholder:text-[#b0b0b0] focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10 transition resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Booking Summary */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#eeece8] pb-4">
                  <h2 className="text-base font-bold text-[#1a1a1a]">Booking Summary</h2>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    selectedSlotIso ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                    {selectedSlotIso ? "Ready" : "Pending Selection"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-[#1a1a1a]">
                  <div className="flex justify-between">
                    <span className="text-[#6b6b6b]">Format</span>
                    <span className="font-semibold capitalize">{appointmentType.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b6b6b]">Date</span>
                    <span className="font-semibold">{selectedDate.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6b6b6b]">Time</span>
                    <span className="font-semibold">
                      {slots.find((s) => s.iso === selectedSlotIso)?.label ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#eeece8] pt-3 font-semibold">
                    <span>Practitioner Fee</span>
                    <span>{doctor ? `₦${doctor.consultationFee}` : "—"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canBook}
                  className="w-full rounded-full bg-[#2641FF] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 transition hover:bg-[#1a30e8] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Booking appointment…" : "Confirm & Schedule"}
                </button>

                <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] p-4 text-xs text-[#6b6b6b] space-y-1">
                  <span className="font-semibold text-[#1a1a1a]">Intake Notice:</span>
                  <p>Please arrive/log in 10 minutes prior to your booking. Cancel at least 2 hours in advance to avoid a service fee.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PatientShellClient>
  );
}
