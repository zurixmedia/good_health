"use client";

import React, { useState, useTransition } from "react";
import { DashboardShell } from "@/app/doctor/dashboard/components/dashboard-shell";
import {
  updateDoctorProfile,
  type DoctorProfileFormData,
  type UpdateDoctorProfileInput,
} from "./actions";
import { cn } from "@/lib/utils";

// ─── Sub-components ──────────────────────────────────────────────────────────

function VerificationBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    VERIFIED: { label: "✓ Verified", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    PENDING: { label: "⏳ Pending Review", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    REJECTED: { label: "✗ Rejected", cls: "bg-red-50 text-red-700 border-red-200" },
    SUSPENDED: { label: "⚠ Suspended", cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const entry = map[status] ?? { label: status, cls: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border", entry.cls)}>
      {entry.label}
    </span>
  );
}

function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
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

function Input({
  className,
  disabled,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
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

function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition resize-none",
        "placeholder:text-[#b0b0b0]",
        "focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10",
        className,
      )}
      rows={4}
      {...props}
    />
  );
}

function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
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

// ─── Main Component ───────────────────────────────────────────────────────────

type Props = { initialData: DoctorProfileFormData };

export function ProfilePageClient({ initialData }: Props) {
  const { user, doctor, specializations, hospitals, linkedHospitalIds } = initialData;

  const [form, setForm] = useState<UpdateDoctorProfileInput>({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber ?? "",
    bio: doctor.bio ?? "",
    specializationId: doctor.specializationId ?? "",
    licenseNumber: doctor.licenseNumber ?? "",
    yearsOfExperience: doctor.yearsOfExperience ?? 0,
    consultationFee: doctor.consultationFee ?? 0,
    supportsVirtualConsultation: doctor.supportsVirtualConsultation,
    hospitalIds: linkedHospitalIds,
  });

  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  function set<K extends keyof UpdateDoctorProfileInput>(
    key: K,
    value: UpdateDoctorProfileInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleHospital(hospitalId: string) {
    setForm((f) => ({
      ...f,
      hospitalIds: f.hospitalIds.includes(hospitalId)
        ? f.hospitalIds.filter((id) => id !== hospitalId)
        : [...f.hospitalIds, hospitalId],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateDoctorProfile(form);
      if (result.success) {
        setToast({ type: "success", msg: "Profile updated successfully!" });
      } else {
        setToast({ type: "error", msg: result.error ?? "Update failed" });
      }
      setTimeout(() => setToast(null), 4000);
    });
  }

  return (
    <DashboardShell user={user}>
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed top-5 right-5 z-50 rounded-2xl px-5 py-4 text-sm font-semibold shadow-xl transition-all",
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white",
          )}
        >
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">
          My Profile
        </h1>
        <p className="text-sm text-[#6b6b6b]">
          Manage your public profile and practice information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity card */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-2xl font-extrabold text-[#2641FF] ring-4 ring-[#eef0ff]">
              {user.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profileImageUrl}
                  alt={user.firstName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold text-[#1a1a1a]">
                  Dr. {user.firstName} {user.lastName}
                </span>
                <VerificationBadge status={doctor.verificationStatus} />
              </div>
              <p className="text-sm text-[#6b6b6b]">
                {doctor.specializationName ?? "No specialization set"} ·{" "}
                {user.email}
              </p>
              {!doctor.profileCompleted && (
                <p className="text-xs font-medium text-amber-600">
                  ⚠ Complete your profile to appear in patient searches.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal info section */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
          <h2 className="mb-5 text-base font-bold text-[#1a1a1a]">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="First Name" required>
              <Input
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="First name"
                required
              />
            </FormField>
            <FormField label="Last Name" required>
              <Input
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Last name"
                required
              />
            </FormField>
            <FormField label="Email Address">
              <Input value={user.email} disabled />
            </FormField>
            <FormField label="Phone Number" hint="Used for appointment reminders">
              <Input
                value={form.phoneNumber}
                onChange={(e) => set("phoneNumber", e.target.value)}
                placeholder="+234 800 000 0000"
                type="tel"
              />
            </FormField>
          </div>
        </div>

        {/* Practice info */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
          <h2 className="mb-5 text-base font-bold text-[#1a1a1a]">
            Practice Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Specialization">
              <Select
                value={form.specializationId}
                onChange={(e) => set("specializationId", e.target.value)}
              >
                <option value="">Select specialization…</option>
                {specializations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Medical License Number">
              <Input
                value={form.licenseNumber}
                onChange={(e) => set("licenseNumber", e.target.value)}
                placeholder="e.g. MDCN/R/0000"
              />
            </FormField>
            <FormField label="Years of Experience">
              <Input
                type="number"
                min={0}
                max={60}
                value={form.yearsOfExperience}
                onChange={(e) =>
                  set("yearsOfExperience", parseInt(e.target.value) || 0)
                }
                placeholder="0"
              />
            </FormField>
            <FormField
              label="Consultation Fee (₦)"
              hint="Per appointment fee in Naira"
            >
              <Input
                type="number"
                min={0}
                value={form.consultationFee}
                onChange={(e) =>
                  set("consultationFee", parseFloat(e.target.value) || 0)
                }
                placeholder="5000"
              />
            </FormField>
            <div className="col-span-full">
              <FormField label="Biography">
                <Textarea
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Tell patients about your experience, approach to care, and areas of expertise…"
                />
              </FormField>
            </div>
          </div>

          {/* Virtual consultations toggle */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#eeece8] bg-[#faf9f7] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">
                Virtual Consultations
              </p>
              <p className="text-xs text-[#6b6b6b]">
                Allow patients to book video call appointments
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.supportsVirtualConsultation}
              onClick={() =>
                set(
                  "supportsVirtualConsultation",
                  !form.supportsVirtualConsultation,
                )
              }
              className={cn(
                "relative flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors",
                form.supportsVirtualConsultation ? "bg-[#2641FF]" : "bg-[#d1d5db]",
              )}
            >
              <span
                className={cn(
                  "absolute h-5 w-5 rounded-full bg-white shadow transition-transform",
                  form.supportsVirtualConsultation
                    ? "translate-x-6"
                    : "translate-x-1",
                )}
              />
            </button>
          </div>
        </div>

        {/* Affiliated hospitals */}
        {hospitals.length > 0 && (
          <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
            <h2 className="mb-1 text-base font-bold text-[#1a1a1a]">
              Affiliated Hospitals
            </h2>
            <p className="mb-4 text-xs text-[#6b6b6b]">
              Select hospitals where you see patients in-person.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((h) => {
                const checked = form.hospitalIds.includes(h.id);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => toggleHospital(h.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition",
                      checked
                        ? "border-[#2641FF] bg-[#eef0ff]"
                        : "border-[#eeece8] bg-white hover:border-[#2641FF]/40",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 h-4 w-4 flex-shrink-0 rounded-sm border-2 transition",
                        checked
                          ? "border-[#2641FF] bg-[#2641FF]"
                          : "border-[#d1d5db]",
                      )}
                    >
                      {checked && (
                        <svg
                          viewBox="0 0 12 12"
                          fill="none"
                          className="h-full w-full p-0.5"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                        {h.name}
                      </p>
                      <p className="text-xs text-[#9b9b9b]">
                        {h.city}, {h.state}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() =>
              setForm({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber ?? "",
                bio: doctor.bio ?? "",
                specializationId: doctor.specializationId ?? "",
                licenseNumber: doctor.licenseNumber ?? "",
                yearsOfExperience: doctor.yearsOfExperience ?? 0,
                consultationFee: doctor.consultationFee ?? 0,
                supportsVirtualConsultation: doctor.supportsVirtualConsultation,
                hospitalIds: linkedHospitalIds,
              })
            }
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
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
