import { getPatientProfileFormData } from "./actions";
import { ProfilePageClient } from "./profile-client";

export const metadata = {
  title: "My Profile | GoodHealth",
  description: "Manage your personal information, health details, and emergency contacts.",
};

export default async function PatientProfilePage() {
  const initialData = await getPatientProfileFormData();
  return <ProfilePageClient initialData={initialData} />;
}
