import { getDoctorNotifications } from "./actions";
import { getDoctorDashboardData } from "@/app/doctor/dashboard/actions";
import { NotificationsPageClient } from "./notifications-client";

export const metadata = {
  title: "Notifications | GoodHealth Doctor",
  description: "Stay updated on appointments, platform changes, and membership alerts.",
};

export default async function DoctorNotificationsPage() {
  const [notifications, dashData] = await Promise.all([
    getDoctorNotifications(),
    getDoctorDashboardData(),
  ]);

  return <NotificationsPageClient notifications={notifications} user={dashData.user} />;
}
