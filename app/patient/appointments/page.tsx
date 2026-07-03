import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { AppointmentBookingClient } from "./appointments-client";

export const metadata = {
  title: "Book Appointment | GoodHealth",
  description: "Schedule consultations and clinical visits with your doctor.",
};

export default async function PatientAppointmentsBookingPage() {
  const profileData = await getPatientProfileFormData();

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return <AppointmentBookingClient user={shellUser} />;
}
