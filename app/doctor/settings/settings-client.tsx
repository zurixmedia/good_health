"use client";

import React, { useState, useTransition } from "react";
import { DashboardShell } from "@/app/doctor/dashboard/components/dashboard-shell";
import { saveSettings, deleteAccount, type DoctorSettings } from "./actions";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
  id,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[#eeece8] last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#1a1a1a]">{label}</p>
        {description && <p className="text-xs text-[#9b9b9b] mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          "relative flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors duration-200",
          checked ? "bg-[#2641FF]" : "bg-[#d1d5db]",
        )}
      >
        <span
          className={cn(
            "absolute h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white p-6">
      <h2 className="text-base font-bold text-[#1a1a1a] mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ─── Delete Account Modal ─────────────────────────────────────────────────────

function DeleteAccountModal({
  onClose,
  onConfirm,
  isPending,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const [typed, setTyped] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl mx-auto">⚠️</div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Delete Your Account?</h2>
          <p className="text-sm text-[#6b6b6b] mt-1">
            This action is permanent and irreversible. All your profile, appointment, and consultation data will be deleted.
          </p>
        </div>
        <div>
          <label className="text-xs font-semibold text-[#1a1a1a] block mb-1.5">Type <span className="font-mono font-bold">DELETE</span> to confirm</label>
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-xl border border-[#eeece8] px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-full border border-[#eeece8] py-2.5 text-sm font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={typed !== "DELETE" || isPending}
            className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-40"
          >
            {isPending ? "Processing…" : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type InitialData = DoctorSettings & {
  email: string;
  firstName: string;
  lastName: string;
  supportsVirtual: boolean;
};

type Props = {
  initial: InitialData;
  user: { firstName: string; lastName: string; email: string; profileImageUrl: string | null };
};

export function SettingsPageClient({ initial, user }: Props) {
  const [settings, setSettings] = useState<DoctorSettings>({
    emailNotifications: initial.emailNotifications,
    smsNotifications: initial.smsNotifications,
    appointmentReminders: initial.appointmentReminders,
    newBookingAlerts: initial.newBookingAlerts,
    cancellationAlerts: initial.cancellationAlerts,
    consultationReminders: initial.consultationReminders,
    marketingEmails: initial.marketingEmails,
    allowVirtualConsultation: initial.allowVirtualConsultation,
    twoFactorEnabled: initial.twoFactorEnabled,
  });
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  function toggle(key: keyof DoctorSettings) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveSettings(settings);
      if (result.success) {
        setToast({ type: "success", msg: "Settings saved successfully." });
      } else {
        setToast({ type: "error", msg: result.error ?? "Failed to save settings." });
      }
      setTimeout(() => setToast(null), 4000);
    });
  }

  function handleDeleteAccount() {
    startDeleteTransition(async () => {
      const result = await deleteAccount();
      if (result.success) {
        setShowDeleteModal(false);
        setToast({ type: "success", msg: "Deletion request submitted. You'll receive a confirmation email." });
      } else {
        setToast({ type: "error", msg: result.error ?? "Failed to submit deletion request." });
      }
      setTimeout(() => setToast(null), 6000);
    });
  }

  return (
    <DashboardShell user={user}>
      {toast && (
        <div className={cn("fixed top-5 right-5 z-50 rounded-2xl px-5 py-4 text-sm font-semibold shadow-xl",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
          {toast.msg}
        </div>
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          isPending={isDeletePending}
        />
      )}

      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Settings</h1>
        <p className="text-sm text-[#6b6b6b]">Manage your notifications, practice preferences, and account.</p>
      </div>

      <div className="space-y-5">
        {/* Account info */}
        <SectionCard title="Account Information">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-4 py-3">
              <p className="text-xs text-[#9b9b9b] mb-1">Full Name</p>
              <p className="text-sm font-semibold text-[#1a1a1a]">Dr. {initial.firstName} {initial.lastName}</p>
            </div>
            <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-4 py-3">
              <p className="text-xs text-[#9b9b9b] mb-1">Email Address</p>
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">{initial.email}</p>
            </div>
          </div>
          <p className="text-xs text-[#9b9b9b] mt-3">
            To update your name or email, go to{" "}
            <a href="/doctor/profile" className="text-[#2641FF] font-semibold hover:underline">Profile Settings</a>.
          </p>
        </SectionCard>

        {/* Practice settings */}
        <SectionCard title="Practice Settings">
          <ToggleRow
            id="virtual-consult"
            label="Virtual Consultations"
            description="Allow patients to book video call appointments with you"
            checked={settings.allowVirtualConsultation}
            onToggle={() => toggle("allowVirtualConsultation")}
          />
          <ToggleRow
            id="two-factor"
            label="Two-Factor Authentication"
            description="Require 2FA on every login for extra security"
            checked={settings.twoFactorEnabled}
            onToggle={() => toggle("twoFactorEnabled")}
          />
        </SectionCard>

        {/* Email notifications */}
        <SectionCard title="Email Notifications">
          <ToggleRow
            id="email-notifs"
            label="Email Notifications"
            description="Receive important updates via email"
            checked={settings.emailNotifications}
            onToggle={() => toggle("emailNotifications")}
          />
          <ToggleRow
            id="new-booking"
            label="New Booking Alerts"
            description="Get notified when a patient books an appointment"
            checked={settings.newBookingAlerts}
            onToggle={() => toggle("newBookingAlerts")}
          />
          <ToggleRow
            id="cancellation"
            label="Cancellation Alerts"
            description="Get notified when an appointment is cancelled"
            checked={settings.cancellationAlerts}
            onToggle={() => toggle("cancellationAlerts")}
          />
          <ToggleRow
            id="appt-reminders"
            label="Appointment Reminders"
            description="Receive reminders before upcoming appointments"
            checked={settings.appointmentReminders}
            onToggle={() => toggle("appointmentReminders")}
          />
          <ToggleRow
            id="consult-reminders"
            label="Consultation Reminders"
            description="Receive reminders before virtual consultations"
            checked={settings.consultationReminders}
            onToggle={() => toggle("consultationReminders")}
          />
          <ToggleRow
            id="marketing"
            label="Marketing Emails"
            description="Receive platform updates, tips, and promotional offers"
            checked={settings.marketingEmails}
            onToggle={() => toggle("marketingEmails")}
          />
        </SectionCard>

        {/* SMS notifications */}
        <SectionCard title="SMS Notifications">
          <ToggleRow
            id="sms-notifs"
            label="SMS Alerts"
            description="Receive SMS notifications for critical appointment updates"
            checked={settings.smsNotifications}
            onToggle={() => toggle("smsNotifications")}
          />
        </SectionCard>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-base font-bold text-red-700 mb-1">Danger Zone</h2>
          <p className="text-sm text-red-600 mb-4">
            These actions are permanent and cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-full border border-red-400 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            Delete My Account
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-[#2641FF] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 hover:bg-[#1a30e8] transition active:scale-95 disabled:opacity-60"
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
              "Save Settings"
            )}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
