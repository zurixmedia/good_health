import { getPatientNotifications } from "./actions";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { NotificationsPageClient } from "./notifications-client";

export const metadata = {
  title: "Notifications | GoodHealth",
  description: "Stay updated on appointments, platform changes, and membership status.",
};

export default async function PatientNotificationsPage() {
  const [notifications, profileData] = await Promise.all([
    getPatientNotifications(),
    getPatientProfileFormData(),
  ]);

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return (
    <NotificationsPageClient
      initialNotifications={notifications}
      user={shellUser}
    />
  );
}
