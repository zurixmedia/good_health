import { getDoctorPatients } from "./actions";
import { getDoctorDashboardData } from "@/app/doctor/dashboard/actions";
import { MedicalHistoryPageClient } from "./medical-history-client";

export const metadata = {
  title: "Patient Records | GoodHealth Doctor",
  description: "Search and browse your full patient database with clinical consultation history.",
};

export default async function DoctorMedicalHistoryPage() {
  const [patients, dashData] = await Promise.all([
    getDoctorPatients(),
    getDoctorDashboardData(),
  ]);

  return <MedicalHistoryPageClient patients={patients} user={dashData.user} />;
}
