import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createMeetingToken } from "@/lib/daily";
import {
  getAuthorizedConsultation,
  isAppointmentJoinable,
} from "../../_access";
import { ConsultationStatus } from "@/app/generated/prisma/enums";

/**
 * POST /api/consultations/[consultationId]/join
 *
 * Returns a short-lived Daily.co meeting token + the room url so the caller
 * can join the video session in-browser. Marks the consultation ACTIVE on the
 * first join and stamps `startedAt`. Only the assigned patient or doctor may
 * join, and only while the underlying appointment is still joinable.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ consultationId: string }> },
) {
  const { consultationId } = await context.params;

  const access = await getAuthorizedConsultation(consultationId);
  if (!access) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { consultation, role } = access;

  if (!isAppointmentJoinable(consultation.appointment.appointmentStatus)) {
    return NextResponse.json(
      { error: "This appointment can no longer be joined" },
      { status: 400 },
    );
  }

  if (consultation.status === ConsultationStatus.COMPLETED) {
    return NextResponse.json(
      { error: "This consultation has already ended" },
      { status: 400 },
    );
  }

  if (!consultation.meetingRoomId || !consultation.meetingUrl) {
    return NextResponse.json(
      { error: "Room has not been provisioned yet" },
      { status: 400 },
    );
  }

  // Name the participant for the Daily UI and make the doctor the call owner
  // (owner can end the meeting for everyone).
  const party =
    role === "DOCTOR"
      ? consultation.appointment.doctor.user
      : consultation.appointment.patient.user;
  const participantName = `${role === "DOCTOR" ? "Dr." : ""} ${party.firstName} ${party.lastName}`.trim();

  try {
    const { token } = await createMeetingToken({
      roomName: consultation.meetingRoomId,
      participantName,
      isOwner: role === "DOCTOR",
    });

    // Flip to ACTIVE + stamp start time the first time someone joins.
    if (
      consultation.status !== ConsultationStatus.ACTIVE &&
      !consultation.startedAt
    ) {
      await prisma.consultation.update({
        where: { id: consultation.id },
        data: {
          status: ConsultationStatus.ACTIVE,
          startedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      token,
      roomUrl: consultation.meetingUrl,
      roomName: consultation.meetingRoomId,
      provider: consultation.meetingProvider,
    });
  } catch (error) {
    console.error("[join consultation]", error);
    const message =
      error instanceof Error ? error.message : "Failed to join room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
