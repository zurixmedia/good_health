import { getPatientSettings } from "./actions";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { SettingsPageClient } from "./settings-client";

export const metadata = {
  title: "Settings | GoodHealth",
  description: "Manage your account, contact details, and notification preferences.",
};

export default async function PatientSettingsPage() {
  const [initialData, profileData] = await Promise.all([
    getPatientSettings(),
    getPatientProfileFormData(),
  ]);

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return <SettingsPageClient initialData={initialData} user={shellUser} />;
}
