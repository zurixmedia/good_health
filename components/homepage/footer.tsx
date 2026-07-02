"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X Twitter",
    href: "https://twitter.com",
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const quickLinks = [
  { label: "About Us", href: "#about-us" },
  { label: "Our Services", href: "/patient/doctors" },
  { label: "Contact Us", href: "#footer" },
  { label: "Terms & Condition", href: "#" },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-[#41460c] text-white pt-16 pb-8 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-12 border-b border-white/10">
          {/* Address Column */}
          <div className="space-y-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-300">
              Address
            </h3>
            <address className="space-y-3 text-sm text-slate-100 not-italic">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>12b street, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
                <a
                  href="tel:+2348123456789"
                  className="hover:text-sky-300 transition-colors"
                >
                  +234 812 345 6789
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:hello@goodhealth.ng"
                  className="hover:text-sky-300 transition-colors"
                >
                  hello@goodhealth.ng
                </a>
              </div>
            </address>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-300">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-100" role="list">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-sky-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="space-y-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-300">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label={`Follow us on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-5">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-300">
              Newsletter
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              Subscribe to stay updated with our latest features &amp; discounts
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center bg-white/10 rounded-full p-1.5 border border-white/20"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@email.com"
                className="w-full bg-transparent border-none text-white text-sm outline-none px-3 placeholder:text-slate-400"
                required
                autoComplete="email"
              />
              <button
                type="submit"
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-semibold rounded-full px-5 py-2 transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shrink-0"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-xs sm:text-sm text-slate-300">
            &copy; {new Date().getFullYear()} GoodHealth. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            Designed for Trust, Simplicity, and Accessibility.
          </p>
        </div>
      </div>
    </footer>
  );
}
