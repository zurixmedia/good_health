/**
 * Admin Membership Routes
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Management | GoodHealth Admin",
  description: "Manage membership plans and subscriptions",
};

export default function MembershipAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
