import { getMembershipPlans } from "@/actions/memberships";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { MembershipClient } from "./membership-client";

export const metadata = {
  title: "Membership | GoodHealth",
  description: "Select the membership subscription that fits your healthcare needs.",
};

export default async function PatientMembershipBrowsePage() {
  const [plans, profileData] = await Promise.all([
    getMembershipPlans(),
    getPatientProfileFormData(),
  ]);

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return <MembershipClient plans={plans} user={shellUser} />;
}
