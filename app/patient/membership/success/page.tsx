import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { SubscriptionSuccessClient } from "./success-client";

export const metadata = {
  title: "Subscription Activated | GoodHealth",
  description: "Your GoodHealth tier membership was successfully activated.",
};

export default async function PatientSubscriptionSuccessPage() {
  const profileData = await getPatientProfileFormData();

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return <SubscriptionSuccessClient user={shellUser} />;
}
