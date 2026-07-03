"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import { cn, formatCurrency } from "@/lib/utils";

type MembershipPlan = {
  id: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number | null;
  consultationLimit: number | null;
  supportsVirtualConsultation: boolean;
};

type Props = {
  plans: MembershipPlan[];
  user: PatientUser;
};

export function MembershipClient({ plans, user }: Props) {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleSelectPlan = (planId: string) => {
    router.push(`/patient/membership/${planId}/checkout?period=${billingPeriod}`);
  };

  return (
    <PatientShellClient user={user} title="Membership Plans">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Choose Your Membership Plan</h1>
        <p className="text-sm text-[#6b6b6b]">
          Gain unlimited access to our network of qualified healthcare professionals. Choose the plan that works best for you.
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex rounded-full bg-[#f5f5f5] p-1">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-bold transition",
              billingPeriod === "monthly" ? "bg-white text-[#1a1a1a] shadow-sm" : "text-[#6b6b6b] hover:text-[#1a1a1a]",
            )}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={cn(
              "rounded-full px-5 py-2 text-xs font-bold transition",
              billingPeriod === "yearly" ? "bg-white text-[#1a1a1a] shadow-sm" : "text-[#6b6b6b] hover:text-[#1a1a1a]",
            )}
          >
            Yearly Billing (Save 20%)
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {plans.map((plan) => {
          const rawPrice = billingPeriod === "monthly" ? Number(plan.monthlyPrice) : Number(plan.yearlyPrice || 0);
          const price = formatCurrency(rawPrice);
          const periodText = billingPeriod === "monthly" ? "/ mo" : "/ yr";

          return (
            <div
              key={plan.id}
              className="flex flex-col rounded-2xl border border-[#eeece8] bg-white p-6 justify-between hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-bold text-[#1a1a1a]">{plan.name}</h3>
                <p className="text-xs text-[#6b6b6b] mt-1 min-h-[32px]">{plan.description}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#1a1a1a]">{price}</span>
                  <span className="text-xs text-[#9b9b9b]">{periodText}</span>
                </div>

                <ul className="mt-6 space-y-3 border-t border-[#eeece8] pt-6 text-sm text-[#6b6b6b]">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>
                      {plan.consultationLimit ? `${plan.consultationLimit} Consultations` : "Unlimited Consultations"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>
                      {plan.supportsVirtualConsultation ? "Includes secure video calls" : "In-person visits only"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Shared Electronic Health Record</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className="w-full mt-8 rounded-full bg-[#2641FF] py-2.5 text-xs font-semibold text-white transition hover:bg-[#1a30e8] active:scale-95"
              >
                Select {plan.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div className="border-t border-[#eeece8] pt-10">
        <h2 className="text-center text-lg font-bold text-[#1a1a1a] mb-6">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {[
            { q: "Can I change my plan later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle." },
            { q: "Can I cancel my membership?", a: "Absolutely. You can cancel anytime from your account settings. No hidden fees or penalties." },
            { q: "What payment methods do you accept?", a: "We accept all major credit cards, debit cards, and secure bank transfer methods." },
            { q: "Is my medical data secure?", a: "Yes, we use industry-standard encryption and fully comply with data protection regulations." },
          ].map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </PatientShellClient>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#eeece8] bg-white p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#1a1a1a] hover:opacity-75 transition"
      >
        <span>{q}</span>
        <span className="text-[#9b9b9b]">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-3 text-xs text-[#6b6b6b] leading-relaxed border-t border-[#f5f5f5] pt-3">{a}</p>}
    </div>
  );
}
