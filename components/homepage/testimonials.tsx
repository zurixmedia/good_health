"use client";

import Image from "next/image";

interface Testimonial {
  quote: string;
  author: string;
  location: string;
  avatar: string;
  alt: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I've been using the single subscription package for the past six months, and it has made booking hospital appointments so much easier. No more long waits or confusion – just straightforward and reliable service. Highly recommended!",
    author: "Funmilayo Bunmi",
    location: "Lagos",
    avatar: "/avatar-male.png",
    alt: "Funmilayo Bunmi",
  },
  {
    quote:
      "As a single professional, I need quick access to healthcare services. The single subscription package has been perfect for me. It is affordable, and the services are top-notch. I can't imagine going back to the old way of booking appointments.",
    author: "Adesuwa Michael",
    location: "Lagos",
    avatar: "/avatar-female.png",
    alt: "Adesuwa Michael",
  },
];

export function Testimonials() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-950"
          >
            <span className="relative inline-block">
              What
              <span
                className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-[#22c55e]"
                aria-hidden="true"
              />
            </span>{" "}
            Our Users Say
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-left max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow relative flex flex-col sm:flex-row gap-6 items-start"
            >
              {/* Avatar */}
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                <Image
                  src={t.avatar}
                  alt={t.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* Quote Content */}
              <figcaption className="space-y-4 flex-1 min-w-0">
                <blockquote>
                  <span
                    className="text-4xl font-serif text-[#0ea5e9] leading-none block h-6"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-600">
                    {t.quote}
                  </p>
                </blockquote>
                <div className="pt-2 border-t border-slate-200/60">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t.author}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
