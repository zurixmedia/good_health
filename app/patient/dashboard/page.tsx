import Link from "next/link";
import { getDashboardData } from "./actions";
import { DashboardShell } from "./components/dashboard-shell";
import { QuickActions } from "./components/quick-actions";
import { UpcomingAppointments } from "./components/upcoming-appointments";
import { NotificationsSection } from "./components/notifications-section";

export const metadata = {
  title: "Dashboard | GoodHealth",
  description:
    "Manage your appointments, membership, and health profile from your GoodHealth patient dashboard.",
};

export default async function PatientDashboardPage() {
  const data = await getDashboardData();

  return (
    <DashboardShell user={data.user}>
      {/* Welcome heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a1a1a]">
          Welcome,{" "}
          <span className="font-extrabold">{data.user.firstName}</span>{" "}
          <span aria-hidden>🤩</span>
        </h1>
      </div>

      {/* Quick actions row */}
      <QuickActions profileCompleted={data.user.profileCompleted} />

      {/* Upcoming appointments */}
      <section className="mt-10" aria-labelledby="upcoming-appointments-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="upcoming-appointments-heading"
            className="text-xl font-bold text-[#1a1a1a]"
          >
            Your Upcoming Appointments
          </h2>
          <Link
            href="/patient/appointments"
            className="text-sm font-semibold text-[#2641FF] hover:underline"
            id="view-all-appointments-link"
          >
            View all
          </Link>
        </div>
        <UpcomingAppointments appointments={data.upcomingAppointments} />
      </section>

      {/* Notifications */}
      <section className="mt-10" aria-labelledby="notifications-heading">
        <h2
          id="notifications-heading"
          className="mb-4 text-xl font-bold text-[#1a1a1a]"
        >
          Notifications
        </h2>
        <NotificationsSection notifications={data.notifications} />
      </section>
    </DashboardShell>
  );
}
