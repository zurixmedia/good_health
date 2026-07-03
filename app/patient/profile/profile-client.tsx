"use client";

import React, { useState, useTransition } from "react";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import {
  updatePatientProfile,
  type PatientProfileFormData,
  type UpdatePatientProfileInput,
} from "./actions";
import { cn } from "@/lib/utils";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#1a1a1a]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#9b9b9b]">{hint}</p>}
    </div>
  );
}

function Input({ className, disabled, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition",
        "placeholder:text-[#b0b0b0]",
        "focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10",
        disabled && "bg-[#faf9f7] text-[#9b9b9b] cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}

function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition appearance-none",
        "focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition resize-none",
        "placeholder:text-[#b0b0b0]",
        "focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10",
        className,
      )}
      rows={3}
      {...props}
    />
  );
}

type Props = { initialData: PatientProfileFormData };

export function ProfilePageClient({ initialData }: Props) {
  const { user, patient } = initialData;

  const [form, setForm] = useState<UpdatePatientProfileInput>({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber ?? "",
    dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().slice(0, 10) : "",
    gender: patient.gender ?? "",
    address: patient.address ?? "",
    bloodGroup: patient.bloodGroup ?? "",
    emergencyContactName: patient.emergencyContactName ?? "",
    emergencyContactPhone: patient.emergencyContactPhone ?? "",
  });

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Profile completeness
  const filledFields = [form.dateOfBirth, form.gender, form.address, form.emergencyContactName, form.emergencyContactPhone].filter(Boolean).length;
  const completionPct = filledFields * 20;

  function set<K extends keyof UpdatePatientProfileInput>(key: K, value: UpdatePatientProfileInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updatePatientProfile(form);
      if (result.success) {
        setToast({ type: "success", msg: "Profile updated successfully!" });
      } else {
        setToast({ type: "error", msg: result.error ?? "Update failed" });
      }
      setTimeout(() => setToast(null), 4000);
    });
  }

  const shellUser: PatientUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
  };

  return (
    <PatientShellClient user={shellUser} title="Profile">
      {/* Toast */}
      {toast && (
        <div className={cn("fixed top-5 right-5 z-50 rounded-2xl px-5 py-4 text-sm font-semibold shadow-xl transition-all",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">My Profile</h1>
        <p className="text-sm text-[#6b6b6b]">Manage your personal and health information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity card */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-2xl font-extrabold text-[#2641FF] ring-4 ring-[#eef0ff]">
              {user.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.profileImageUrl} alt={user.firstName} className="h-full w-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span className="text-xl font-bold text-[#1a1a1a]">
                {user.firstName} {user.lastName}
              </span>
              <p className="text-sm text-[#6b6b6b]">{user.email}</p>
            </div>
            {/* Completion badge */}
            <div className="flex flex-col items-end gap-1">
              <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border",
                completionPct === 100 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                {completionPct === 100 ? "✓ Complete" : `${completionPct}% Complete`}
              </span>
              <div className="w-32 h-1.5 bg-[#eeece8] rounded-full overflow-hidden">
                <div className="h-full bg-[#2641FF] rounded-full transition-all" style={{ width: `${completionPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
          <h2 className="mb-5 text-base font-bold text-[#1a1a1a]">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="First Name" required>
              <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
            </FormField>
            <FormField label="Last Name" required>
              <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
            </FormField>
            <FormField label="Email Address">
              <Input value={user.email} disabled />
            </FormField>
            <FormField label="Phone Number" hint="Used for appointment reminders">
              <Input value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} placeholder="+234 800 000 0000" type="tel" />
            </FormField>
            <FormField label="Date of Birth">
              <Input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
            </FormField>
            <FormField label="Gender">
              <Select value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="">Select gender…</option>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </Select>
            </FormField>
            <div className="col-span-full">
              <FormField label="Home Address">
                <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address, city, state…" />
              </FormField>
            </div>
          </div>
        </div>

        {/* Health info */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
          <h2 className="mb-5 text-base font-bold text-[#1a1a1a]">Health Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Blood Group">
              <div className="flex flex-wrap gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => set("bloodGroup", form.bloodGroup === bg ? "" : bg)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-semibold transition",
                      form.bloodGroup === bg
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-[#eeece8] bg-white text-[#6b6b6b] hover:border-red-300",
                    )}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        </div>

        {/* Emergency contact */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
          <h2 className="mb-1 text-base font-bold text-[#1a1a1a]">Emergency Contact</h2>
          <p className="mb-5 text-xs text-[#6b6b6b]">This person will be contacted in case of an emergency during your appointment.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Contact Name">
              <Input value={form.emergencyContactName} onChange={(e) => set("emergencyContactName", e.target.value)} placeholder="Full name" />
            </FormField>
            <FormField label="Contact Phone">
              <Input value={form.emergencyContactPhone} onChange={(e) => set("emergencyContactPhone", e.target.value)} placeholder="+234 800 000 0000" type="tel" />
            </FormField>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => setForm({
              firstName: user.firstName,
              lastName: user.lastName,
              phoneNumber: user.phoneNumber ?? "",
              dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().slice(0, 10) : "",
              gender: patient.gender ?? "",
              address: patient.address ?? "",
              bloodGroup: patient.bloodGroup ?? "",
              emergencyContactName: patient.emergencyContactName ?? "",
              emergencyContactPhone: patient.emergencyContactPhone ?? "",
            })}
            className="rounded-full border border-[#eeece8] px-6 py-2.5 text-sm font-semibold text-[#6b6b6b] transition hover:bg-[#f5f5f5]"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#2641FF] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 transition hover:bg-[#1a30e8] active:scale-95 disabled:opacity-60"
          >
            {isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Saving…
              </>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
    </PatientShellClient>
  );
}
