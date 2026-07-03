import { getDoctorSubscription } from "./actions";
import { getDoctorDashboardData } from "@/app/doctor/dashboard/actions";
import { MembershipPageClient } from "./membership-client";

export const metadata = {
  title: "Membership | GoodHealth Doctor",
  description: "Manage your GoodHealth provider plan and upgrade to Premium.",
};

export default async function DoctorMembershipPage() {
  const [subscription, dashData] = await Promise.all([
    getDoctorSubscription(),
    getDoctorDashboardData(),
  ]);

  return <MembershipPageClient subscription={subscription} user={dashData.user} />;
}
