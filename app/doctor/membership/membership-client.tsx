"use client";

import React, { useState, useTransition } from "react";
import { DashboardShell } from "@/app/doctor/dashboard/components/dashboard-shell";
import { upgradeDoctorMembership, type DoctorSubscriptionData } from "./actions";
import { cn } from "@/lib/utils";

// ─── Upgrade Modal ────────────────────────────────────────────────────────────

function UpgradeModal({
  onClose,
  onConfirm,
  isPending,
}: {
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const [step, setStep] = useState<"confirm" | "payment" | "success">("confirm");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [payPending, startPayTransition] = useTransition();

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    startPayTransition(async () => {
      await onConfirm();
      setStep("success");
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {step === "confirm" && (
          <>
            <div className="px-6 py-5 border-b border-[#eeece8] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Upgrade to Premium</h2>
              <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full text-[#9b9b9b] hover:bg-[#f5f5f5]">✕</button>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#2641FF] to-indigo-500 p-5 text-white">
                <p className="text-xs font-semibold opacity-80 mb-1">PREMIUM PROVIDER</p>
                <p className="text-3xl font-extrabold">₦12,500<span className="text-base font-normal opacity-80">/month</span></p>
                <p className="text-xs opacity-70 mt-1">or ₦125,000/year (save 17%)</p>
              </div>
              <ul className="space-y-2.5 text-sm text-[#1a1a1a]">
                {[
                  "Only 5% platform commission (vs 15%)",
                  "Verified Premium badge on your profile",
                  "Featured placement in patient searches",
                  "Priority support with 4h response SLA",
                  "Advanced analytics & earnings insights",
                  "Early access to new platform features",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep("payment")}
                className="w-full rounded-full bg-[#2641FF] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/25 hover:bg-[#1a30e8] transition"
              >
                Continue to Payment →
              </button>
            </div>
          </>
        )}

        {step === "payment" && (
          <form onSubmit={handlePay}>
            <div className="px-6 py-5 border-b border-[#eeece8] flex items-center justify-between">
              <button onClick={() => setStep("confirm")} className="text-[#9b9b9b] hover:text-[#1a1a1a] text-sm">← Back</button>
              <h2 className="text-base font-bold text-[#1a1a1a]">Payment Details</h2>
              <button type="button" onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full text-[#9b9b9b] hover:bg-[#f5f5f5]">✕</button>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-100 px-4 py-3">
                <span className="text-sky-600">🔒</span>
                <p className="text-xs text-sky-700">Your payment is encrypted and secure.</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Cardholder Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Dr. Firstname Lastname" className="w-full rounded-xl border border-[#eeece8] px-4 py-2.5 text-sm outline-none focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Card Number</label>
                  <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g,'').slice(0,16))} required placeholder="•••• •••• •••• ••••" maxLength={16} className="w-full rounded-xl border border-[#eeece8] px-4 py-2.5 text-sm font-mono outline-none focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">Expiry (MM/YY)</label>
                    <input value={expiry} onChange={e => setExpiry(e.target.value)} required placeholder="MM/YY" maxLength={5} className="w-full rounded-xl border border-[#eeece8] px-4 py-2.5 text-sm font-mono outline-none focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1a1a1a] mb-1.5">CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))} required placeholder="•••" maxLength={4} type="password" className="w-full rounded-xl border border-[#eeece8] px-4 py-2.5 text-sm font-mono outline-none focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-[#6b6b6b]">Total due today</span>
                <span className="font-bold text-[#1a1a1a]">₦12,500</span>
              </div>
              <button type="submit" disabled={payPending} className="w-full rounded-full bg-[#2641FF] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/25 hover:bg-[#1a30e8] transition disabled:opacity-60">
                {payPending ? "Processing…" : "Pay ₦12,500 Now"}
              </button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="px-6 py-10 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">Upgrade Requested!</h2>
            <p className="text-sm text-[#6b6b6b]">Your Premium Provider upgrade request has been received. Our team will activate it within 24 hours. You'll get a notification once it's live.</p>
            <button onClick={onClose} className="w-full rounded-full bg-[#2641FF] py-3 text-sm font-semibold text-white hover:bg-[#1a30e8] transition">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Props = {
  subscription: DoctorSubscriptionData;
  user: { firstName: string; lastName: string; email: string; profileImageUrl: string | null };
};

export function MembershipPageClient({ subscription, user }: Props) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isPremium = subscription.currentTier === "PREMIUM";

  async function handleUpgrade() {
    const result = await upgradeDoctorMembership();
    if (result.success) {
      setToast("Upgrade request submitted! You'll be notified within 24 hours.");
    } else {
      setToast("Failed to submit upgrade. Please try again.");
    }
    setTimeout(() => setToast(null), 5000);
  }

  return (
    <DashboardShell user={user}>
      {toast && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-emerald-600 text-white px-5 py-4 text-sm font-semibold shadow-xl">
          {toast}
        </div>
      )}

      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onConfirm={handleUpgrade}
          isPending={false}
        />
      )}

      {/* Page header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Provider Membership</h1>
        <p className="text-sm text-[#6b6b6b]">Choose your provider tier and unlock premium features.</p>
      </div>

      {/* Current plan banner */}
      <div className={cn(
        "mb-8 rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center gap-4",
        isPremium ? "border-[#2641FF]/20 bg-[#eef0ff]" : "border-[#eeece8] bg-white",
      )}>
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2641FF] text-white text-2xl">
          {isPremium ? "⭐" : "🏥"}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#9b9b9b] uppercase tracking-wider">Current Plan</p>
          <p className="text-xl font-extrabold text-[#1a1a1a]">
            {isPremium ? "Premium Provider" : "Standard Provider"}
          </p>
          <p className="text-sm text-[#6b6b6b]">
            {isPremium
              ? "You're on the Premium plan. Enjoy reduced commissions and priority features."
              : "You're on the Standard plan. Upgrade to unlock lower commission rates and more visibility."}
          </p>
        </div>
        {!isPremium && (
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex-shrink-0 rounded-full bg-[#2641FF] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 hover:bg-[#1a30e8] transition"
          >
            Upgrade Now
          </button>
        )}
      </div>

      {/* Plan comparison cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Standard */}
        <div className={cn(
          "rounded-3xl border p-6 flex flex-col gap-5",
          !isPremium ? "border-[#2641FF] ring-2 ring-[#2641FF]/20" : "border-[#eeece8]",
          "bg-white",
        )}>
          {!isPremium && (
            <span className="w-fit rounded-full bg-[#2641FF] px-3 py-1 text-xs font-bold text-white">
              Current Plan
            </span>
          )}
          <div>
            <p className="text-xs font-semibold text-[#9b9b9b] uppercase tracking-wider">Standard</p>
            <p className="text-3xl font-extrabold text-[#1a1a1a] mt-1">
              Free <span className="text-base font-normal text-[#9b9b9b]">forever</span>
            </p>
          </div>
          <ul className="space-y-2.5 text-sm text-[#6b6b6b] flex-1">
            {[
              { ok: true, text: "List on GoodHealth platform" },
              { ok: true, text: "Unlimited physical appointments" },
              { ok: true, text: "Virtual consultations (if enabled)" },
              { ok: false, text: "15% platform commission on earnings" },
              { ok: false, text: "Standard search placement" },
              { ok: false, text: "Basic analytics only" },
            ].map(({ ok, text }) => (
              <li key={text} className={cn("flex items-start gap-2.5", !ok && "opacity-50")}>
                <span className={cn("mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-xs",
                  ok ? "bg-emerald-100 text-emerald-600" : "bg-red-50 text-red-400")}>
                  {ok ? "✓" : "✗"}
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Premium */}
        <div className={cn(
          "rounded-3xl border p-6 flex flex-col gap-5 relative overflow-hidden",
          isPremium ? "border-[#2641FF] ring-2 ring-[#2641FF]/20" : "border-[#2641FF]/30",
          "bg-gradient-to-br from-white to-[#f8f9ff]",
        )}>
          {/* Recommended badge */}
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-[#2641FF] to-indigo-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl">
              RECOMMENDED
            </div>
          </div>

          {isPremium && (
            <span className="w-fit rounded-full bg-[#2641FF] px-3 py-1 text-xs font-bold text-white">
              Current Plan
            </span>
          )}

          <div>
            <p className="text-xs font-semibold text-[#2641FF] uppercase tracking-wider">Premium</p>
            <p className="text-3xl font-extrabold text-[#1a1a1a] mt-1">
              ₦12,500<span className="text-base font-normal text-[#9b9b9b]">/month</span>
            </p>
            <p className="text-xs text-[#9b9b9b]">₦125,000/year — save 17%</p>
          </div>

          <ul className="space-y-2.5 text-sm text-[#1a1a1a] flex-1">
            {[
              "Everything in Standard",
              "Only 5% platform commission",
              "Verified Premium badge on profile",
              "Featured placement in search results",
              "Priority support (4h response SLA)",
              "Advanced analytics & earnings insights",
              "Early access to new platform features",
            ].map((text) => (
              <li key={text} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[#2641FF] text-xs">✓</span>
                {text}
              </li>
            ))}
          </ul>

          {!isPremium ? (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full rounded-full bg-[#2641FF] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2641FF]/20 hover:bg-[#1a30e8] transition"
            >
              Upgrade to Premium →
            </button>
          ) : (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
              ✓ You are on this plan
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-8 rounded-2xl border border-[#eeece8] bg-white p-6">
        <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "When does my Premium plan activate?",
              a: "Your premium features activate within 24 hours of successful payment. You'll receive a notification once your account is upgraded.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. You can cancel your Premium subscription at any time from this page. Your plan remains active until the end of the billing period.",
            },
            {
              q: "How is the platform commission calculated?",
              a: "Commission is deducted from completed virtual consultation fees. Standard providers pay 15%; Premium providers pay only 5%.",
            },
          ].map(({ q, a }) => (
            <FaqItem key={q} question={q} answer={a} />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#eeece8] pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left gap-3"
      >
        <p className="text-sm font-semibold text-[#1a1a1a]">{question}</p>
        <span className="flex-shrink-0 text-[#9b9b9b]">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="mt-2 text-sm text-[#6b6b6b] leading-relaxed">{answer}</p>}
    </div>
  );
}
