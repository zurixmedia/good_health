import { notFound } from "next/navigation";
import { getConsultationForRoom } from "../actions";
import { ConsultationRoomClient } from "./client";

type Props = {
  params: Promise<{ consultationId: string }>;
};

export default async function ConsultationRoomPage({ params }: Props) {
  const { consultationId } = await params;
  const consultation = await getConsultationForRoom(consultationId);

  if (!consultation) {
    notFound();
  }

  return <ConsultationRoomClient consultation={consultation} />;
}
