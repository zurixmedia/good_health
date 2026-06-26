/**
 * Patient Membership Routes
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership | GoodHealth",
  description: "Manage your GoodHealth membership",
};

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
