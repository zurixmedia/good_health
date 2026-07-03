import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { DoctorDiscoveryClient } from "./doctors-client";

export const metadata = {
  title: "Practitioner Directory | GoodHealth",
  description: "Browse and select verified healthcare professionals in your network.",
};

export default async function PatientDoctorsPage() {
  const profileData = await getPatientProfileFormData();

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return <DoctorDiscoveryClient user={shellUser} />;
}
