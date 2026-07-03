"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import { createMembershipSubscription } from "@/actions/memberships";
import { formatCurrency } from "@/lib/utils";

type MembershipPlan = {
  id: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number | null;
};

type Props = {
  plan: MembershipPlan;
  period: "monthly" | "yearly";
  user: PatientUser;
};

export function MembershipCheckoutClient({ plan, period, user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const priceVal = period === "monthly" ? Number(plan.monthlyPrice) : Number(plan.yearlyPrice || 0);
  const formattedPrice = formatCurrency(priceVal);

  const handleSubscribe = () => {
    startTransition(async () => {
      try {
        await createMembershipSubscription(plan.id, period);
        router.push("/patient/membership/success");
      } catch (err) {
        console.error("Failed to subscribe:", err);
      }
    });
  };

  return (
    <PatientShellClient user={user} title="Checkout">
      <div className="max-w-2xl mx-auto rounded-2xl border border-[#eeece8] bg-white p-6 space-y-6">
        <div className="border-b border-[#eeece8] pb-4">
          <h1 className="text-xl font-bold text-[#1a1a1a]">Confirm Subscription</h1>
          <p className="text-sm text-[#6b6b6b] mt-0.5">Please review your plan choice before finalizing payment.</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-[#faf9f7] rounded-xl p-4 border border-[#eeece8]">
            <div>
              <p className="text-sm font-bold text-[#1a1a1a]">{plan.name}</p>
              <p className="text-xs text-[#6b6b6b] capitalize mt-0.5">{period} billing cycle</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-[#1a1a1a]">{formattedPrice}</span>
              <span className="text-xs text-[#9b9b9b]"> / {period === "monthly" ? "mo" : "yr"}</span>
            </div>
          </div>

          <div className="space-y-3 border-t border-[#eeece8] pt-4 text-sm text-[#1a1a1a]">
            <h3 className="font-bold">Billing Details</h3>
            <div className="flex justify-between text-[#6b6b6b]">
              <span>Subtotal</span>
              <span>{formattedPrice}</span>
            </div>
            <div className="flex justify-between text-[#6b6b6b]">
              <span>Tax (VAT 0%)</span>
              <span>₦0.00</span>
            </div>
            <div className="flex justify-between border-t border-[#eeece8] pt-3 font-extrabold text-base">
              <span>Total Due</span>
              <span>{formattedPrice}</span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-[#eef0ff]/20 p-4 text-xs text-[#6b6b6b] space-y-1.5">
            <span className="font-bold text-[#2641FF]">Subscription Terms:</span>
            <p>
              By clicking "Confirm & Subscribe", you authorize GoodHealth to start your recurring subscription. Your plan will auto-renew. You can cancel at any time in your Settings.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#eeece8]">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-[#eeece8] px-6 py-2.5 text-xs font-semibold text-[#6b6b6b] hover:bg-[#f5f5f5] transition"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isPending}
            className="rounded-full bg-[#2641FF] px-8 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#2641FF]/20 transition hover:bg-[#1a30e8] active:scale-95 disabled:opacity-60"
          >
            {isPending ? "Processing..." : "Confirm & Subscribe"}
          </button>
        </div>
      </div>
    </PatientShellClient>
  );
}
