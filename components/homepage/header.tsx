"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about-us" },
  { label: "Contact Us", href: "#footer" },
  { label: "Sign In", href: "/login" },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-md shadow-slate-900/5"
          : "bg-white border-b border-gray-100 shadow-sm",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 sm:h-20 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="GoodHealth home"
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-2 ring-white shadow-lg transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="GoodHealth logo"
              fill
              priority
              sizes="40px"
              className="object-cover"
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            GoodHealth
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-full transition-colors hover:text-[#0ea5e9] hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/register"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#0ea5e9] px-6 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition-all hover:bg-[#0284c7] hover:shadow-lg hover:shadow-sky-500/25 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
          >
            Sign Up for Free
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden relative h-10 w-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className="sr-only">Menu</span>
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "md:hidden fixed inset-x-0 top-16 bottom-0 bg-white z-40 transition-all duration-300 ease-out overflow-y-auto",
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none",
        )}
      >
        <nav className="flex flex-col px-6 py-8 gap-2" aria-label="Mobile navigation links">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMobile}
              className="flex items-center h-14 px-4 text-lg font-semibold text-slate-700 rounded-xl transition-colors hover:text-[#0ea5e9] hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8">
          <Link
            href="/register"
            onClick={closeMobile}
            className="flex h-14 items-center justify-center rounded-full bg-[#0ea5e9] text-lg font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:bg-[#0284c7] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
          >
            Sign Up for Free
          </Link>
        </div>
      </div>
    </header>
  );
}
