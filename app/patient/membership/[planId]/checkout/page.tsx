import { getMembershipPlanById } from "@/actions/memberships";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { MembershipCheckoutClient } from "./checkout-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Checkout | GoodHealth",
  description: "Confirm your selected subscription tier details.",
};

type PageProps = {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{ period?: string }>;
};

export default async function PatientMembershipCheckoutPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const planId = resolvedParams.planId;
  const period = (resolvedSearchParams.period || "monthly") as "monthly" | "yearly";

  const [plan, profileData] = await Promise.all([
    getMembershipPlanById(planId),
    getPatientProfileFormData(),
  ]);

  if (!plan) {
    redirect("/patient/membership");
  }

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return (
    <MembershipCheckoutClient
      plan={plan}
      period={period}
      user={shellUser}
    />
  );
}
