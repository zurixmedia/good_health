"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

interface PlanFeature {
  label: string;
}

interface PricingPlan {
  name: string;
  subtitle: string;
  features: PlanFeature[];
  price: string;
  popular?: boolean;
  ctaStyle: "filled" | "outlined";
}

const plans: PricingPlan[] = [
  {
    name: "Single Membership",
    subtitle: "For individuals who want priority care",
    features: [
      { label: "Simplicity & Convenience" },
      { label: "Personalized Healthcare" },
      { label: "No Shared Costs" },
      { label: "Flexibility" },
    ],
    price: "₦ 4,000",
    ctaStyle: "outlined",
  },
  {
    name: "Family Membership",
    subtitle: "Best value plan for family packages",
    features: [
      { label: "Comprehensive Family Coverage" },
      { label: "Convenient & Coordinated Care" },
      { label: "Cost Savings" },
      { label: "Shared Benefits" },
    ],
    price: "₦ 3,000",
    popular: true,
    ctaStyle: "filled",
  },
];

export function Pricing() {
  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24 border-y border-slate-100"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-950"
          >
            <span className="relative inline-block">
              Our
              <span
                className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-[#22c55e]"
                aria-hidden="true"
              />
            </span>{" "}
            Pricing
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Our pricing plans are designed to be affordable, flexible, and
            tailored to your needs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left Credit Card Image (hidden on mobile/tablet) */}
          <div className="hidden lg:block relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <Image
              src="/pricing-credit-card.png"
              alt="Woman holding credit card for payment"
              fill
              sizes="25vw"
              className="object-cover"
            />
          </div>

          {/* Pricing Cards */}
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6 text-left flex flex-col h-full justify-between relative transition-shadow hover:shadow-lg ${
                plan.popular
                  ? "bg-white border-2 border-[#0ea5e9] shadow-lg shadow-sky-500/10"
                  : "bg-slate-50 border border-slate-200/60"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-6 sm:right-8 -translate-y-1/2 bg-[#22c55e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Popular
                </div>
              )}

              {/* Plan Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {plan.subtitle}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feat) => (
                    <div key={feat.label} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-sky-100 flex items-center justify-center text-[#0ea5e9] shrink-0">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {feat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-6 border-t border-slate-200/80 space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500">/ Month</span>
                </div>
                <Link
                  href="/register"
                  className={`flex h-12 items-center justify-center rounded-full text-sm font-semibold transition-all active:scale-95 ${
                    plan.ctaStyle === "filled"
                      ? "bg-[#0ea5e9] text-white shadow-md shadow-sky-500/20 hover:bg-[#0284c7] hover:shadow-lg hover:shadow-sky-500/25"
                      : "border-2 border-[#0ea5e9] text-[#0ea5e9] hover:bg-sky-50"
                  }`}
                >
                  Select Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
