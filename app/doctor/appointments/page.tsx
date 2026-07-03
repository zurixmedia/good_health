import { getDoctorAppointments } from "./actions";
import { getDoctorDashboardData } from "@/app/doctor/dashboard/actions";
import { AppointmentsPageClient } from "./appointments-client";

export const metadata = {
  title: "Appointments | GoodHealth Doctor",
  description: "View, accept, decline and manage all your patient appointments.",
};

export default async function DoctorAppointmentsPage() {
  const [appointments, dashData] = await Promise.all([
    getDoctorAppointments(),
    getDoctorDashboardData(),
  ]);

  return <AppointmentsPageClient appointments={appointments} user={dashData.user} />;
}
