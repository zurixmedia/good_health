import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };
const inter = { variable: "--font-sans" };

export const metadata: Metadata = {
  title: {
    default: "GoodHealth",
    template: "%s | GoodHealth",
  },
  description: "Trusted healthcare platform — book appointments with verified doctors, manage memberships, and access virtual consultations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          "h-full",
          "antialiased",
          geistSans.variable,
          geistMono.variable,
          "font-sans",
          inter.variable,
        )}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
