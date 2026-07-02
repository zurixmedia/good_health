"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

const bullets = [
  "Quality Hospitals",
  "Fair Prices",
  "Flexible Packages",
  "User-Friendly Interface",
];

export function AboutUs() {
  return (
    <section
      id="about-us"
      className="py-16 sm:py-20 lg:py-24 scroll-mt-20"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column Content */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div>
              <h2
                id="about-heading"
                className="text-3xl sm:text-4xl font-extrabold text-slate-950"
              >
                <span className="relative inline-block">
                  About
                  <span
                    className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-[#22c55e]"
                    aria-hidden="true"
                  />
                </span>{" "}
                Us
              </h2>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              We are committed to improving the healthcare experience by providing
              a reliable and efficient platform for booking hospital appointments.
              We ensure that you receive the care you need without hassle.
            </h3>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              GoodHealth aims at providing quality, seamless, and affordable
              healthcare for our users. Our platform is designed to save you time
              and effort, allowing you to focus on what matters most – your health.
            </p>

            {/* Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {bullets.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-sky-100 flex items-center justify-center text-[#0ea5e9] shrink-0">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0ea5e9] px-8 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition-all hover:bg-[#0284c7] hover:shadow-lg hover:shadow-sky-500/25 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
              >
                Make Appointment
              </Link>
            </div>
          </div>

          {/* Right Column — Overlapping Images */}
          <div className="lg:col-span-6 flex justify-center relative min-h-[300px] sm:min-h-[400px] lg:min-h-[480px]">
            {/* Large Hospital Image */}
            <div className="w-[85%] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl ring-4 ring-white relative">
              <Image
                src="/about-hospital.png"
                alt="Modern hospital building with glass facade"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover"
              />
            </div>

            {/* Small Overlapping Doctor Office Picture */}
            <div className="absolute right-0 bottom-0 w-[50%] sm:w-[48%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white">
              <Image
                src="/about-doctor-work.png"
                alt="Doctor working at a modern medical workstation"
                fill
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
