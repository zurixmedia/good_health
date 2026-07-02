import { Check } from "lucide-react";

const features = [
  {
    name: "Easy",
    desc: "Simple interface for all ages",
    accent: "bg-sky-100 text-sky-700",
    ring: "ring-sky-200",
  },
  {
    name: "Convenient",
    desc: "Access care from anywhere",
    accent: "bg-yellow-100 text-yellow-700",
    ring: "ring-yellow-200",
  },
  {
    name: "Trusted",
    desc: "Only verified doctors",
    accent: "bg-green-100 text-green-700",
    ring: "ring-green-200",
  },
  {
    name: "Smooth",
    desc: "No long waiting queues",
    accent: "bg-cyan-100 text-cyan-700",
    ring: "ring-cyan-200",
  },
];

export function Features() {
  return (
    <section className="bg-white border-y border-slate-100 py-10 lg:py-14" aria-label="Platform features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-16 justify-items-center">
          {features.map((feat) => (
            <div
              key={feat.name}
              className="flex flex-col items-center text-center space-y-3 group"
            >
              <div
                className={`h-14 w-14 rounded-full bg-sky-50 ring-4 ${feat.ring}/30 flex items-center justify-center text-[#0ea5e9] transition-transform group-hover:scale-110`}
              >
                <Check className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{feat.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
