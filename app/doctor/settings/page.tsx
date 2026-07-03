import { getDoctorSettings } from "./actions";
import { getDoctorDashboardData } from "@/app/doctor/dashboard/actions";
import { SettingsPageClient } from "./settings-client";

export const metadata = {
  title: "Settings | GoodHealth Doctor",
  description: "Manage notifications, practice preferences, and account security.",
};

export default async function DoctorSettingsPage() {
  const [initial, dashData] = await Promise.all([
    getDoctorSettings(),
    getDoctorDashboardData(),
  ]);

  return <SettingsPageClient initial={initial} user={dashData.user} />;
}
