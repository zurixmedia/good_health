import Link from "next/link";
import { Glasses, Heart, Baby, Bone, Sparkles } from "lucide-react";

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
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

const specializations = [
  {
    title: "Dentistry",
    desc: "Take care of your oral health today by having routine dental checkups with qualified dentists",
    icon: SmileIcon,
  },
  {
    title: "Optometry",
    desc: "Comprehensive eye exams, regular screenings, vision therapy, are some of the services our opticians provide.",
    icon: Glasses,
  },
  {
    title: "Cardiology",
    desc: "Cardiac Consultations are available to assess and diagnose heart-related issue to achieve healthy living",
    icon: Heart,
  },
  {
    title: "Pediatrics",
    desc: "Take your child for regular check-ups to monitor his/her growth and development and protect them against diseases",
    icon: Baby,
  },
  {
    title: "Orthopedics",
    desc: "Treatment for broken bones, joint replacement surgeries, physical therapy, are some of the services our hospitals provide",
    icon: Bone,
  },
  {
    title: "Dermatology",
    desc: "Comprehensive skin check, medications screenings, and so on are conducted by our hospitals.",
    icon: Sparkles,
  },
];

export function Coverage() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="coverage-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2
            id="coverage-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display"
          >
            <span className="relative inline-block">
              Complete
              <span
                className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-[#22c55e]"
                aria-hidden="true"
              />
            </span>{" "}
            Coverage
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We offer a full spectrum of medical specializations and services,
            ensuring comprehensive healthcare for our users. Some of them are
            shown below.
          </p>
        </div>

        {/* Specializations Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {specializations.map((spec) => {
            const IconComponent = spec.icon;
            return (
              <div
                key={spec.title}
                className="group bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center text-center space-y-4"
              >
                <div className="h-16 w-16 rounded-full bg-sky-50 text-[#0ea5e9] flex items-center justify-center ring-4 ring-sky-100/50 transition-transform group-hover:scale-110">
                  <IconComponent className="h-8 w-8" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {spec.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Link
            href="/patient/doctors"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#0ea5e9] px-8 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition-all hover:bg-[#0284c7] hover:shadow-lg hover:shadow-sky-500/25 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0ea5e9]"
          >
            Browse All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
}
