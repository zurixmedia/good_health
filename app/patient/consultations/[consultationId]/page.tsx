import { notFound } from "next/navigation";
import { getConsultationForRoom } from "../actions";
import { getPatientProfileFormData } from "@/app/patient/profile/actions";
import { ConsultationRoomClient } from "./client";

type Props = {
  params: Promise<{ consultationId: string }>;
};

export default async function ConsultationRoomPage({ params }: Props) {
  const { consultationId } = await params;

  const [consultation, profileData] = await Promise.all([
    getConsultationForRoom(consultationId),
    getPatientProfileFormData(),
  ]);

  if (!consultation) {
    notFound();
  }

  const shellUser = {
    firstName: profileData.user.firstName,
    lastName: profileData.user.lastName,
    email: profileData.user.email,
    profileImageUrl: profileData.user.profileImageUrl,
  };

  return (
    <ConsultationRoomClient
      consultation={consultation}
      user={shellUser}
    />
  );
}
