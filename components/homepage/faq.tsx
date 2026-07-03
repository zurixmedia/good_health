"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "Do I need an account to book an appointment?",
    answer:
      "Yes, creating an account helps us secure your health information, track your booking history, and send you direct consultation links.",
  },
  {
    question: "What types of doctors are available?",
    answer:
      "We have verified specialists across Dentistry, Optometry, Cardiology, Pediatrics, Orthopedics, and Dermatology.",
  },
  {
    question: "How do I book an appointment with a doctor?",
    answer:
      "Simply sign up, browse our verified doctor directory, select a doctor, choose your preferred date/time slot, and confirm the booking.",
  },
  {
    question: "Can I reschedule or cancel my appointment?",
    answer:
      "Yes, you can easily reschedule or cancel appointments from your patient dashboard up to 24 hours before the scheduled time.",
  },
  {
    question: "Can I book virtual appointments?",
    answer:
      "Yes! GoodHealth supports high-quality secure video consultations. You can join your virtual appointments directly from your dashboard.",
  },
  {
    question: "Can I change my subscription plan at any time?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your membership subscription at any time through the billing settings on your dashboard.",
  },
];

export function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      className="bg-transparent py-16 sm:py-20 lg:py-24 border-t border-slate-100"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display"
          >
            <span className="relative inline-block">
              FA
              <span
                className="absolute bottom-0 left-0 w-[60%] h-1 rounded-full bg-[#22c55e]"
                aria-hidden="true"
              />
            </span>
            Q
          </h2>
          <p className="text-base sm:text-lg font-semibold text-slate-800">
            Have any questions? Read popular answers below.
          </p>
        </div>

        {/* Accordion Grid */}
        <div className="grid md:grid-cols-2 gap-4 items-start">
          {faqItems.map((item, idx) => {
            const isActive = expandedIndex === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-all",
                  isActive
                    ? "border-[#0ea5e9]/30 bg-sky-50/50 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50",
                )}
              >
                <button
                  id={`faq-button-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isActive}
                  aria-controls={`faq-panel-${idx}`}
                  className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left font-semibold text-slate-900 text-sm sm:text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9] transition-colors hover:text-[#0ea5e9]"
                >
                  <span>{item.question}</span>
                  <span className="shrink-0">
                    {isActive ? (
                      <ChevronUp className="h-5 w-5 text-[#0ea5e9]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    )}
                  </span>
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-button-${idx}`}
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  <p className="px-5 sm:px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
