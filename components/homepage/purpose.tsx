import { Target, Compass } from "lucide-react";

const cards = [
  {
    title: "Mission",
    description:
      "To supply dependable and reasonable all-inclusive scope of quantitative, compelling and proficient state-of-the-art well-being care centers to move forward the well-being status of individuals.",
    icon: Target,
  },
  {
    title: "Vision",
    description:
      "Redefining what healthcare is commonly known for, through simplifying and making it more efficient and convenient.",
    icon: Compass,
  },
];

export function Purpose() {
  return (
    <section
      className="bg-transparent py-16 sm:py-20 lg:py-24 border-y border-slate-100"
      aria-labelledby="purpose-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2
                id="purpose-heading"
                className="text-3xl sm:text-4xl font-extrabold text-slate-950"
              >
                <span className="relative inline-block">
                  Purpo
                  <span
                    className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-[#22c55e]"
                    aria-hidden="true"
                  />
                </span>
                se
              </h2>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              Striving for seamless healthcare access is our priority!
            </h3>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              We hope to make you happy with the services we provide.
            </p>
          </div>

          {/* Right Column — Mission & Vision Cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {cards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.title}
                  className="group bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col space-y-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-sky-100 text-[#0ea5e9] flex items-center justify-center transition-transform group-hover:scale-110">
                    <IconComponent className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {card.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
