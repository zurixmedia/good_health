"use client";

import { Heart, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backLabel?: string;
  backHref?: string;
  backOnClick?: () => void;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  backLabel,
  backHref,
  backOnClick,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex">
      {/* ─── Left Branding Panel (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0ea5e9] to-[#0369a1] relative flex-col items-center justify-center p-12 text-white overflow-hidden">
        {/* Decorative circles — positions match Figma */}
        <div className="absolute top-[-5rem] left-[-5rem] w-72 h-72 rounded-full bg-white/10" />
        <div
          className="absolute bottom-[-6rem] right-[-6rem] w-96 h-96 rounded-full bg-white/[0.06]"
        />
        <div className="absolute top-1/2 right-12 w-44 h-44 rounded-full bg-white/10 -translate-y-1/2" />

        {/* Logo — top-left */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 z-20">
          <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Heart className="h-6 w-6 fill-white stroke-white" />
          </div>
          <span className="text-2xl font-bold text-white">GoodHealth</span>
        </Link>

        {/* Hero illustration — centered */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-[6px] border-white/20 shadow-2xl z-10">
          <Image
            src="/hero-doctor.png"
            alt="Doctor"
            fill
            className="object-cover"
            priority
          />
        </div>

        <p className="mt-8 text-lg text-center font-medium max-w-xs z-10 leading-relaxed text-white/90">
          Your trusted platform for quality healthcare appointments
        </p>
      </div>

      {/* ─── Right Form Panel ─── */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Mobile logo — shown only on small screens */}
        <div className="lg:hidden flex items-center justify-center gap-2.5 pt-8 pb-2 px-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Heart className="h-5 w-5 fill-white stroke-[#0284c7]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            GoodHealth
          </span>
        </div>

        {/* Form content — vertically and horizontally centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
          <div className="w-full max-w-[440px] space-y-7">
            {/* Back link (optional) */}
            {(backLabel && backHref) || (backLabel && backOnClick) ? (
              backOnClick ? (
                <button
                  type="button"
                  onClick={backOnClick}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0ea5e9] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </button>
              ) : (
                <Link
                  href={backHref!}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0ea5e9] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backLabel}
                </Link>
              )
            ) : null}

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-[1.75rem] leading-tight font-bold text-slate-950 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Form */}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
