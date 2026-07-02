import { notFound } from "next/navigation";
import { getDoctorConsultationForRoom } from "../actions";
import { DoctorConsultationRoomClient } from "./client";

type Props = {
  params: Promise<{ consultationId: string }>;
};

export default async function DoctorConsultationRoomPage({ params }: Props) {
  const { consultationId } = await params;
  const consultation = await getDoctorConsultationForRoom(consultationId);

  if (!consultation) {
    notFound();
  }

  return <DoctorConsultationRoomClient consultation={consultation} />;
}
