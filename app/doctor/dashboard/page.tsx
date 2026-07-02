import Link from "next/link";
import { getDoctorDashboardData } from "./actions";
import { DashboardShell } from "./components/dashboard-shell";
import { TodaysAppointments } from "./components/todays-appointments";
import { PatientQueue } from "./components/patient-queue";
import { EarningsSummary } from "./components/earnings-summary";
import { AvailabilitySummary } from "./components/availability-summary";
import { ConsultationHistory } from "./components/consultation-history";
import { NotificationsSection } from "./components/notifications-section";
import { ProfileSummary } from "./components/profile-summary";
import { formatLongDate } from "./components/format";

export const metadata = {
  title: "Doctor Dashboard | GoodHealth",
  description:
    "Manage your appointments, patient queue, availability, consultations, and earnings from your GoodHealth doctor dashboard.",
};

export default async function DoctorDashboardPage() {
  const data = await getDoctorDashboardData();

  const queueItems = data.todaysAppointments.map((apt) => ({
    id: apt.id,
    patientName: apt.patientName,
    patientInitials: apt.patientInitials,
    appointmentStartTime: apt.appointmentStartTime,
    appointmentStatus: apt.appointmentStatus,
    appointmentType: apt.appointmentType,
  }));

  const unreadCount = data.notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardShell user={data.user}>
      {/* Welcome heading */}
      <div className="mb-6 flex flex-col gap-1">
        <p className="text-sm font-medium text-[#6b6b6b]">
          {formatLongDate(new Date())}
        </p>
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">
          Welcome back, Dr.{" "}
          <span className="font-extrabold">{data.user.firstName}</span>{" "}
          <span aria-hidden>🩺</span>
        </h1>
      </div>

      {/* Top grid: Profile + Earnings */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <ProfileSummary user={data.user} doctor={data.doctor} />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#1a1a1a]">
              Earnings Summary
            </h2>
            <span className="text-xs text-[#9b9b9b]">
              Based on completed consultations
            </span>
          </div>
          <EarningsSummary earnings={data.earnings} />
        </div>
      </section>

      {/* Today's appointments + Patient queue */}
      <section className="mt-8" aria-labelledby="todays-appointments-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="todays-appointments-heading"
            className="text-xl font-bold text-[#1a1a1a]"
          >
            Today&apos;s Appointments
          </h2>
          <Link
            href="/doctor/appointments"
            className="text-sm font-semibold text-[#2641FF] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
          <TodaysAppointments appointments={data.todaysAppointments} />
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold text-[#1a1a1a]">Patient Queue</h3>
            <PatientQueue items={queueItems} />
          </div>
        </div>
      </section>

      {/* Availability + Notifications */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <AvailabilitySummary availability={data.availability} />
        <div id="notifications">
          <NotificationsSection notifications={data.notifications} />
        </div>
      </section>

      {/* Consultation history */}
      <section className="mt-8" aria-labelledby="consultation-history-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="consultation-history-heading"
            className="text-xl font-bold text-[#1a1a1a]"
          >
            Consultation History
          </h2>
          <Link
            href="/doctor/consultations"
            className="text-sm font-semibold text-[#2641FF] hover:underline"
          >
            View all
          </Link>
        </div>
        <ConsultationHistory items={data.consultationHistory} />
      </section>

      {/* Hidden a11y summary of unread notifications for screen readers */}
      <span className="sr-only">
        {unreadCount > 0
          ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
          : "No unread notifications."}
      </span>
    </DashboardShell>
  );
}
