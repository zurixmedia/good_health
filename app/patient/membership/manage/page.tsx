import {
  getPatientActiveMembership,
  getPatientMemberships,
} from "@/actions/memberships";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { MembershipManageClient } from "./manage-client";

export const metadata = {
  title: "Manage Membership | GoodHealth",
  description: "Manage your active subscription plan and renew details.",
};

export default async function PatientMembershipManagePage() {
  const [activeMembership, allMemberships, profileData] = await Promise.all([
    getPatientActiveMembership(),
    getPatientMemberships(),
    getPatientProfileFormData(),
  ]);

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return (
    <MembershipManageClient
      activeMembership={activeMembership}
      allMemberships={allMemberships}
      user={shellUser}
    />
  );
}
