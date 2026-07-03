"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";

type Props = {
  user: PatientUser;
};

export function SubscriptionSuccessClient({ user }: Props) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/patient/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <PatientShellClient user={user} title="Subscription Success">
      <div className="mx-auto max-w-md rounded-2xl border border-[#eeece8] bg-white p-8 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[#1a1a1a]">Subscription Activated!</h1>
          <p className="text-sm text-[#6b6b6b]">
            Your membership is active and your benefits are ready.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-800 text-left space-y-1.5">
          <p>✓ Premium tier benefits unlocked</p>
          <p>✓ Confirmation email sent</p>
          <p>✓ Eligible to schedule care slots</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => router.push("/patient/dashboard")}
            className="w-full rounded-full bg-[#2641FF] py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#2641FF]/10 transition hover:bg-[#1a30e8]"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/patient/doctors")}
            className="w-full rounded-full border border-[#eeece8] py-2.5 text-xs font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition"
          >
            Browse Practitioners
          </button>
        </div>

        <p className="text-[10px] text-[#9b9b9b]">Redirecting to dashboard in 5 seconds...</p>
      </div>
    </PatientShellClient>
  );
}
