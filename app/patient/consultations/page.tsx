import { getMyConsultations } from "./actions";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { ConsultationsClient } from "./consultations-client";

export const metadata = {
  title: "Video Consultations | GoodHealth",
  description: "Join secure room video calls and view summary recommendations.",
};

export default async function PatientConsultationsPage() {
  const [consultations, profileData] = await Promise.all([
    getMyConsultations(),
    getPatientProfileFormData(),
  ]);

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return (
    <ConsultationsClient
      consultations={consultations}
      user={shellUser}
    />
  );
}
