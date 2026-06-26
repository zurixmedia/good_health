"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Check,
  Target,
  Compass,
  Sparkles,
  Baby,
  Bone,
  Glasses,
  Heart,
  Activity,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Feature list below hero
const features = [
  { name: "Easy", desc: "Simple interface for all ages", color: "bg-blue-100 text-blue-700" },
  { name: "Convenient", desc: "Access care from anywhere", color: "bg-yellow-100 text-yellow-700" },
  { name: "Trusted", desc: "Only verified doctors", color: "bg-green-100 text-green-700" },
  { name: "Smooth", desc: "No long waiting queues", color: "bg-cyan-100 text-cyan-700" }
];

// Specializations
const specializations = [
  {
    title: "Dentistry",
    desc: "Take care of your oral health today by having routine dental checkups with qualified dentists",
    icon: SmileIcon
  },
  {
    title: "Optometry",
    desc: "Comprehensive eye exams, regular screenings, vision therapy, are some of the services our opticians provide.",
    icon: Glasses
  },
  {
    title: "Cardiology",
    desc: "Cardiac Consultations are available to assess and diagnose heart-related issue to achieve healthy living",
    icon: Heart
  },
  {
    title: "Pediatrics",
    desc: "Take your child for regular check-ups to monitor his/her growth and development and protect them against diseases",
    icon: Baby
  },
  {
    title: "Orthopedics",
    desc: "Treatment for broken bones, joint replacement surgeries, physical therapy, are some of the services our hospitals provide",
    icon: Bone
  },
  {
    title: "Dermatology",
    desc: "Comprehensive skin check, medications screenings, and so on are conducted by our hospitals.",
    icon: Sparkles
  }
];

// FAQ items
const faqItems = [
  {
    q: "Do I need an account to book an appointment?",
    a: "Yes, creating an account helps us secure your health information, track your booking history, and send you direct consultation links."
  },
  {
    q: "What types of doctors are available?",
    a: "We have verified specialists across Dentistry, Optometry, Cardiology, Pediatrics, Orthopedics, and Dermatology."
  },
  {
    q: "How do I book an appointment with a doctor?",
    a: "Simply sign up, browse our verified doctor directory, select a doctor, choose your preferred date/time slot, and confirm the booking."
  },
  {
    q: "Can I reschedule or cancel my appointment?",
    a: "Yes, you can easily reschedule or cancel appointments from your patient dashboard up to 24 hours before the scheduled time."
  },
  {
    q: "Can I book virtual appointments?",
    a: "Yes! GoodHealth supports high-quality secure video consultations. You can join your virtual appointments directly from your dashboard."
  },
  {
    q: "Can I change my subscription plan at any time?",
    a: "Yes, you can upgrade, downgrade, or cancel your membership subscription at any time through the billing settings on your dashboard."
  }
];

function SmileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen w-full bg-[#fbf8ff] text-slate-900 font-sans selection:bg-blue-100 selection:text-[#002bbd]">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Heart className="h-6 w-6 fill-white stroke-blue-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
              GoodHealth
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-[#002bbd] transition-colors">
              Home
            </Link>
            <a href="#about-us" className="text-sm font-semibold text-slate-600 hover:text-[#002bbd] transition-colors">
              About Us
            </a>
            <a href="#footer" className="text-sm font-semibold text-slate-600 hover:text-[#002bbd] transition-colors">
              Contact Us
            </a>
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-[#002bbd] transition-colors">
              Sign In
            </Link>
          </nav>

          {/* Action button */}
          <div className="hidden md:block">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#002bbd] px-6 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95"
            >
              Sign Up for Free
            </Link>
          </div>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-4 shadow-inner animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#002bbd] py-1 border-b border-slate-50"
              >
                Home
              </Link>
              <a
                href="#about-us"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-[#002bbd] py-1 border-b border-slate-50"
              >
                About Us
              </a>
              <a
                href="#footer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-[#002bbd] py-1 border-b border-slate-50"
              >
                Contact Us
              </a>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-[#002bbd] py-1 border-b border-slate-50"
              >
                Sign In
              </Link>
            </nav>
            <div className="pt-2">
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-12 items-center justify-center rounded-full bg-[#002bbd] text-base font-semibold text-white shadow-md hover:bg-blue-700"
              >
                Sign Up for Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero copy */}
            <div className="lg:col-span-6 space-y-6 lg:pr-4 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                <span className="text-[#002bbd]">Convenient</span> <br className="hidden lg:block"/>
                Healthcare at Good Health!
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Choose from our network of top-rated healthcare providers. Get started today and take the first step towards better health.
              </p>
              <div className="pt-4 flex justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-[#002bbd] px-10 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-6 flex justify-center relative">
              {/* Colored BG shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 pointer-events-none opacity-40">
                <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-blue-300 blur-3xl" />
                <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-purple-300 blur-3xl" />
              </div>

              {/* Circular Doctor Frame */}
              <div className="relative w-72 h-72 sm:w-[420px] sm:h-[420px] rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <Image
                  src="/hero-doctor.png"
                  alt="Friendly female doctor smiling"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white border-y border-slate-100 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {features.map((feat) => (
              <div key={feat.name} className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#002bbd]">
                  <Check className="h-6 w-6 stroke-3" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feat.name}</h3>
                <p className="text-xs text-slate-500 hidden sm:block">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about-us" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold relative pb-3 inline-block text-slate-950">
                  <span className="border-b-4 border-[#22c55e] pb-3">About</span> Us
                </h2>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                We are committed to improving the healthcare experience by providing a reliable and efficient platform for booking hospital appointments. We ensure that you receive the care you need without hassle.
              </h3>
              
              <p className="text-slate-600 text-base leading-relaxed">
                GoodHealth aims at providing quality seamless, and affordable health care for our users. Our platform is designed to save you time and effort, allowing you to focus on what matters most – your health.
              </p>

              {/* Bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Quality Hospitals",
                  "Fair Prices",
                  "Flexible Packages",
                  "User - Friendly Interface"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[#002bbd] shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-3" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="pt-4">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#002bbd] px-8 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md"
                >
                  Make Appointment
                </Link>
              </div>
            </div>

            {/* Right Column Layout (Overlapping Images) */}
            <div className="lg:col-span-6 flex justify-center relative min-h-[360px] sm:min-h-[480px]">
              {/* Large Hospital Image */}
              <div className="w-[80%] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white relative">
                <Image
                  src="/about-hospital.png"
                  alt="Modern Hospital Architecture"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Small overlapping doctor office picture */}
              <div className="absolute right-0 bottom-0 w-[50%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/about-doctor-work.png"
                  alt="Doctor at Workstation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PURPOSE SECTION */}
      <section className="bg-white py-16 lg:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-3xl font-extrabold relative pb-3 inline-block text-slate-950">
                  <span className="border-b-4 border-[#22c55e] pb-3">Purpo</span>se
                </h2>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                Striving for seamless healthcare access is our priority!
              </h3>
              <p className="text-slate-600">
                We hope to make you happy with the services we provide.
              </p>
            </div>

            {/* Right cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              
              {/* Mission Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-[#002bbd] flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Mission</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  To supply dependable and reasonable all-inclusive scope of quantitative, compelling and proficient state-of-the-art well-being care centers to move forward the well-being status of individuals,
                </p>
              </div>

              {/* Vision Card */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-[#002bbd] flex items-center justify-center">
                  <Compass className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Vission</h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Redefining what healthcare is commonly known for, through simplifying and making it more efficient and convenient.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* COMPLETE COVERAGE SECTION */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold relative pb-3 inline-block text-slate-950">
              <span className="border-b-4 border-[#22c55e] pb-3">Complete</span> Coverage
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              We offer a full spectrum of medical specializations and services, ensuring comprehensive healthcare for our users. Some of them are shown below.
            </p>
          </div>

          {/* Grid of Specializations */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {specializations.map((spec) => {
              const IconComponent = spec.icon;
              return (
                <div
                  key={spec.title}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4"
                >
                  <div className="h-16 w-16 rounded-full bg-blue-50 text-[#002bbd] flex items-center justify-center">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{spec.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{spec.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#002bbd] px-8 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              Make Appointment
            </Link>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="bg-white py-16 lg:py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold relative pb-3 inline-block text-slate-950">
              <span className="border-b-4 border-[#22c55e] pb-3">Our</span> Pricing
            </h2>
            <p className="text-base text-slate-600">
              Our pricing plans are designed to be affordable, flexible, and tailored to your needs.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            
            {/* Left Credit Card Image (Hidden on Mobile) */}
            <div className="hidden lg:block relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <Image
                src="/pricing-credit-card.png"
                alt="Woman holding Credit Card"
                fill
                className="object-cover"
              />
            </div>

            {/* Middle Card: Single Membership */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/60 shadow-sm space-y-6 text-left flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Single Membership</h3>
                  <p className="text-xs text-slate-400 mt-1">For individuals who want priority care</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Simplicity & Convenience",
                    "Personalized Healthcare",
                    "No Shared Costs",
                    "Flexibility"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[#002bbd] shrink-0">
                        <Check className="h-3 w-3 stroke-3" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/80 space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₦ 4000</span>
                  <span className="text-sm text-slate-500">/ Month</span>
                </div>
                <Link
                  href="/register"
                  className="flex h-12 items-center justify-center rounded-full border-2 border-[#002bbd] text-sm font-semibold text-[#002bbd] transition-all hover:bg-blue-50 active:scale-95"
                >
                  Select Plan
                </Link>
              </div>
            </div>

            {/* Right Card: Family Membership */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#002bbd] shadow-lg space-y-6 text-left flex flex-col h-full justify-between relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#22c55e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Family Membership</h3>
                  <p className="text-xs text-slate-400 mt-1">Best value plan for family packages</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Comprehensive Family Coverage",
                    "Convenient & Coordinated Care",
                    "Cost Savings",
                    "Shared Benefits"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[#002bbd] shrink-0">
                        <Check className="h-3 w-3 stroke-3" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/80 space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₦ 3000</span>
                  <span className="text-sm text-slate-500">/ Month</span>
                </div>
                <Link
                  href="/register"
                  className="flex h-12 items-center justify-center rounded-full bg-[#002bbd] text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                  Select Plan
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div>
            <h2 className="text-3xl font-extrabold relative pb-3 inline-block text-slate-950">
              <span className="border-b-4 border-[#22c55e] pb-3">What</span> Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            
            {/* Testimonial 1 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60 shadow-sm relative flex flex-col md:flex-row gap-6 items-start">
              <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src="/avatar-male.png"
                  alt="Funmilayo Bunmi Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <span className="text-4xl font-serif text-[#002bbd] leading-none block h-4">“</span>
                <p className="text-sm leading-relaxed text-slate-600">
                  I{"'"}ve been using the single subscription package for the past six months, and it has made booking hospital appointments so much easier. No more long waits or confusion – just straightforward and reliable service. Highly recommended!
                </p>
                <div>
                  <h4 className="font-bold text-slate-900">Funmilayo Bunmi</h4>
                  <p className="text-xs text-slate-400">Lagos</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60 shadow-sm relative flex flex-col md:flex-row gap-6 items-start">
              <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0 border border-slate-200">
                <Image
                  src="/avatar-female.png"
                  alt="Adesuwa Michael Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <span className="text-4xl font-serif text-[#002bbd] leading-none block h-4">“</span>
                <p className="text-sm leading-relaxed text-slate-600">
                  As a single professional, I need quick access to healthcare services. The single subscription package has been perfect for me. It is affordable, and the services are top-notch. I can{"'"}t imagine going back to the old way of booking appointments.
                </p>
                <div>
                  <h4 className="font-bold text-slate-900">Adesuwa Michael</h4>
                  <p className="text-xs text-slate-400">Lagos</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white py-16 lg:py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold relative pb-3 inline-block text-slate-950">
              <span className="border-b-4 border-[#22c55e] pb-3">FA</span>Q
            </h2>
            <p className="text-base font-semibold text-slate-800">
              Have any questions? Read popular answers below.
            </p>
          </div>

          {/* Grid of Accordions */}
          <div className="grid md:grid-cols-2 gap-4 items-start">
            {faqItems.map((item, idx) => {
              const active = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-semibold text-slate-900 text-sm sm:text-base focus:outline-none"
                  >
                    <span>{item.q}</span>
                    {active ? (
                      <ChevronUp className="h-5 w-5 text-[#002bbd] shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {active && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer id="footer" className="bg-[#41460c] text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/10">
            
            {/* Address Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wider text-slate-300">Address</h3>
              <div className="space-y-3 text-sm text-slate-100">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                  <span>12b street, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-300 shrink-0" />
                  <span>+2348123456789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-300 shrink-0" />
                  <span>example123@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wider text-slate-300">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-100">
                <li>
                  <a href="#about-us" className="hover:text-slate-300 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <Link href="/patient/doctors" className="hover:text-slate-300 transition-colors">
                    Our Services
                  </Link>
                </li>
                <li>
                  <a href="#footer" className="hover:text-slate-300 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link href="/register" className="hover:text-slate-300 transition-colors">
                    Terms & Condition
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wider text-slate-300">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                  aria-label="X Twitter"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-wider text-slate-300">Newsletter</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Subscribe to stay updated with our latest features & discounts
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center bg-white/10 rounded-full p-1 border border-white/20 max-w-sm">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full bg-transparent border-none text-white text-sm outline-none px-3 placeholder:text-slate-300"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#002bbd] hover:bg-blue-700 text-white text-sm font-semibold rounded-full px-5 py-2 transition-all active:scale-95"
                >
                  Go
                </button>
              </form>
            </div>

          </div>

          <div className="pt-8 text-center text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>©GoodHealth, All Right Reserved. 2024</p>
            <p className="text-white/60">Designed for Trust, Simplicity, and Accessibility.</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
