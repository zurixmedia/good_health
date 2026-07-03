import { getPatientMedicalHistory } from "./actions";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { MedicalHistoryClient } from "./medical-history-client";

export const metadata = {
  title: "Medical History | GoodHealth",
  description: "View your past medical records, consultations, and test results.",
};

export default async function PatientMedicalHistoryPage() {
  const [initialData, profileData] = await Promise.all([
    getPatientMedicalHistory(),
    getPatientProfileFormData(),
  ]);

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return <MedicalHistoryClient initialData={initialData} user={shellUser} />;
}
