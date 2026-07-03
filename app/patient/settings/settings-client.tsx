"use client";

import React, { useState, useTransition } from "react";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import {
  updatePatientSettings,
  deactivatePatientAccount,
  type PatientSettingsData,
} from "./actions";
import { cn } from "@/lib/utils";

type Props = {
  initialData: PatientSettingsData;
  user: PatientUser;
};

export function SettingsPageClient({ initialData, user }: Props) {
  const { user: settingsUser } = initialData;

  const [phoneNumber, setPhoneNumber] = useState(settingsUser.phoneNumber ?? "");
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updatePatientSettings({ phoneNumber });
      if (res.success) {
        setToast({ type: "success", msg: "Settings saved successfully!" });
      } else {
        setToast({ type: "error", msg: res.error ?? "Failed to save settings" });
      }
      setTimeout(() => setToast(null), 4000);
    });
  };

  const handleDeactivate = () => {
    startTransition(async () => {
      const res = await deactivatePatientAccount();
      if (res.success) {
        setToast({ type: "success", msg: "Account deactivated successfully." });
        window.location.href = "/";
      } else {
        setToast({ type: "error", msg: res.error ?? "Failed to deactivate account" });
        setDeactivateModalOpen(false);
      }
      setTimeout(() => setToast(null), 4000);
    });
  };

  return (
    <PatientShellClient user={user} title="Settings">
      {/* Toast */}
      {toast && (
        <div className={cn("fixed top-5 right-5 z-50 rounded-2xl px-5 py-4 text-sm font-semibold shadow-xl transition-all",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white")}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Settings</h1>
        <p className="text-sm text-[#6b6b6b]">Manage your account preferences and notifications.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile / Account Settings */}
        <form onSubmit={handleSave} className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-4">
          <h2 className="text-base font-bold text-[#1a1a1a]">Account Settings</h2>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1a1a1a]">Email Address</label>
            <input
              type="email"
              value={settingsUser.email}
              disabled
              className="w-full rounded-xl border border-[#eeece8] bg-[#faf9f7] px-4 py-3 text-sm text-[#9b9b9b] cursor-not-allowed outline-none"
            />
            <p className="text-xs text-[#9b9b9b]">Your primary email cannot be changed directly from GoodHealth settings.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1a1a1a]">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+234 800 000 0000"
              className="w-full rounded-xl border border-[#eeece8] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none placeholder:text-[#b0b0b0] focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10 transition"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-[#2641FF] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 transition hover:bg-[#1a30e8] active:scale-95 disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>

        {/* Notifications Mock/Options */}
        <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-4">
          <h2 className="text-base font-bold text-[#1a1a1a]">Notifications</h2>
          <p className="text-xs text-[#6b6b6b] mb-4">Choose how you want to be notified about appointments and platform updates.</p>

          <div className="space-y-4">
            {[
              { id: "email-notif", label: "Email Notifications", desc: "Receive appointment summaries and updates via email." },
              { id: "sms-notif", label: "SMS Alerts", desc: "Receive text reminders 1 hour prior to appointments." },
              { id: "marketing-notif", label: "Marketing & Newsletter", desc: "Keep up-to-date with GoodHealth articles and special discounts." },
            ].map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <label htmlFor={item.id} className="text-sm font-semibold text-[#1a1a1a] cursor-pointer">
                    {item.label}
                  </label>
                  <span className="text-xs text-[#6b6b6b]">{item.desc}</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id={item.id}
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      input.checked = !input.checked;
                    }}
                    className="w-11 h-6 bg-[#eeece8] rounded-full peer-checked:bg-[#2641FF] transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-100 bg-red-50/30 p-6 space-y-4">
          <h2 className="text-base font-bold text-red-600">Danger Zone</h2>
          <p className="text-xs text-[#6b6b6b]">Temporarily deactivate your account. You can reactivate it by logging back in.</p>
          <div className="flex justify-start">
            <button
              onClick={() => setDeactivateModalOpen(true)}
              type="button"
              className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-700"
            >
              Deactivate Account
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Modal */}
      {deactivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setDeactivateModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#1a1a1a]">Deactivate Account?</h3>
            <p className="mt-2 text-sm text-[#6b6b6b]">
              Are you sure you want to deactivate your GoodHealth account? This will hide your profile and cancel upcoming appointments.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeactivateModalOpen(false)}
                className="rounded-full border border-[#eeece8] px-4 py-2 text-sm font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </PatientShellClient>
  );
}
