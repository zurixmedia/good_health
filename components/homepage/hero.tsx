"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-center lg:text-left animate-fade-in-up">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-[#0ea5e9]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0ea5e9] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0ea5e9]" />
              </span>
              Trusted by 10,000+ patients
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-slate-900 leading-[1.1]"
            >
              <span className="text-[#4169E1] font-semibold">Convenient</span>
              <br className="hidden sm:block" />
              <span className="text-slate-900 font-semibold">
                Healthcare at Good Health!
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Choose from our network of top-rated healthcare providers. Get
              started today and take the first step towards better health.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#4169E1] px-8 sm:px-10 text-base font-semibold text-white shadow-xl shadow-blue-500/20 transition-all hover:bg-[#3258d4] hover:shadow-2xl hover:shadow-blue-500/30 hover:translate-y-[-1px] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]"
              >
                Book Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#about-us"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-slate-200 px-8 text-base font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4169E1]"
              >
                Learn More
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-[#22c55e]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-[#22c55e]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure Platform</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-6 flex justify-center relative animate-fade-in-up-delay">
            {/* Decorative background blobs */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute top-10 right-10 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-sky-200/60 blur-3xl animate-float" />
              <div className="absolute bottom-10 left-10 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-purple-200/60 blur-3xl animate-float-delay" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-sky-100/40 to-purple-100/40 blur-2xl" />
            </div>

            {/* Circular Doctor Frame */}
            <div className="relative w-64 h-64 sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden ring-8 ring-white shadow-2xl shadow-slate-900/10">
              <Image
                src="/hero-doctor.png"
                alt="Friendly female doctor in white coat smiling confidently"
                fill
                priority
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 360px, 420px"
                className="object-cover"
              />
            </div>

            {/* Floating stat card — top right */}
            <div className="hidden sm:flex absolute top-4 right-0 lg:top-8 lg:right-4 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-slate-900/10 ring-1 ring-slate-100 items-center gap-3 animate-fade-in-up-delay-2">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-[#22c55e]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500">Appointments</p>
                <p className="text-sm font-bold text-slate-900">50,000+</p>
              </div>
            </div>

            {/* Floating stat card — bottom left */}
            <div className="hidden sm:flex absolute bottom-4 left-0 lg:bottom-8 lg:left-4 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-slate-900/10 ring-1 ring-slate-100 items-center gap-3 animate-fade-in-up-delay-3">
              <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-[#0ea5e9]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500">Happy Patients</p>
                <p className="text-sm font-bold text-slate-900">10,000+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
