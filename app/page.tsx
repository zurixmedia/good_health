import type { Metadata } from "next";
import { AnimatedHealthBackground } from "@/components/background/AnimatedHealthBackground";
import {
  Header,
  Hero,
  Features,
  AboutUs,
  Purpose,
  Coverage,
  Pricing,
  Testimonials,
  FAQ,
  Footer,
} from "@/components/homepage";

export const metadata: Metadata = {
  title: "GoodHealth — Convenient Healthcare at Your Fingertips",
  description:
    "Book hospital appointments with verified doctors across Cardiology, Dentistry, Pediatrics, Dermatology, Orthopedics, and Optometry. Affordable membership plans, virtual consultations, and seamless healthcare access.",
  keywords: [
    "healthcare",
    "hospital appointments",
    "doctors",
    "Nigeria",
    "Lagos",
    "virtual consultations",
    "healthcare membership",
    "medical specialties",
    "book doctor appointment",
    "telemedicine",
  ],
  openGraph: {
    title: "GoodHealth — Convenient Healthcare at Your Fingertips",
    description:
      "Choose from our network of top-rated healthcare providers. Get started today and take the first step towards better health.",
    type: "website",
    locale: "en_NG",
    siteName: "GoodHealth",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoodHealth — Convenient Healthcare at Your Fingertips",
    description:
      "Choose from our network of top-rated healthcare providers. Get started today and take the first step towards better health.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-transparent text-slate-900 font-sans selection:bg-sky-100 selection:text-[#0ea5e9] relative">
      <AnimatedHealthBackground />
      <Header />
      <Hero />
      <Features />
      <AboutUs />
      <Purpose />
      <Coverage />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}
