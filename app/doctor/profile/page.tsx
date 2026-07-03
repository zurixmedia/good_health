import { getProfileFormData } from "./actions";
import { ProfilePageClient } from "./profile-client";

export const metadata = {
  title: "My Profile | GoodHealth Doctor",
  description: "Manage your practice profile, specialization, fees, and hospital affiliations.",
};

export default async function DoctorProfilePage() {
  const initialData = await getProfileFormData();
  return <ProfilePageClient initialData={initialData} />;
}
