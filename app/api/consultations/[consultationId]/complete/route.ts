import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { deleteRoom } from "@/lib/daily";
import { getAuthorizedConsultation } from "../../_access";
import {
  ConsultationStatus,
  AppointmentStatus,
  NotificationType,
} from "@/app/generated/prisma/enums";

type CompleteBody = {
  diagnosis?: unknown;
  recommendations?: unknown;
  followUpRequired?: unknown;
  followUpNotes?: unknown;
};

/**
 * POST /api/consultations/[consultationId]/complete
 * Body (optional, doctor-only): { diagnosis, recommendations, followUpRequired, followUpNotes }
 *
 * Ends the consultation: sets status COMPLETED + endedAt, and (only a doctor)
 * may persist the clinical notes. The underlying appointment is moved to
 * COMPLETED and both parties are notified. The Daily.co room is deleted
 * asynchronously so it can't be rejoined.
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

  // Either party may end the call, but only doctors may write clinical notes.
  let body: CompleteBody = {};
  try {
    body = (await request.json()) as CompleteBody;
  } catch {
    // Body is optional.
  }

  const notes =
    role === "DOCTOR"
      ? {
          diagnosis: typeof body.diagnosis === "string" ? body.diagnosis : null,
          recommendations:
            typeof body.recommendations === "string"
              ? body.recommendations
              : null,
          followUpRequired:
            typeof body.followUpRequired === "boolean"
              ? body.followUpRequired
              : false,
          followUpNotes:
            typeof body.followUpNotes === "string" ? body.followUpNotes : null,
        }
      : {};

  const updated = await prisma.consultation.update({
    where: { id: consultation.id },
    data: {
      status: ConsultationStatus.COMPLETED,
      endedAt: new Date(),
      ...notes,
    },
    select: {
      id: true,
      status: true,
      diagnosis: true,
      recommendations: true,
      followUpRequired: true,
      endedAt: true,
    },
  });

  // Mark the underlying appointment complete.
  await prisma.appointment.update({
    where: { id: consultation.appointment.id },
    data: { appointmentStatus: AppointmentStatus.COMPLETED },
  });

  // Notify both parties.
  const summary = "Your video consultation has ended and notes were saved.";
  const otherUserId =
    role === "DOCTOR"
      ? consultation.appointment.patient.user.id
      : consultation.appointment.doctor.user.id;

  await prisma.notification.createMany({
    data: [
      {
        userId: consultation.appointment.doctor.user.id,
        type: NotificationType.CONSULTATION,
        title: "Consultation completed",
        message: summary,
      },
      {
        userId: otherUserId,
        type: NotificationType.CONSULTATION,
        title: "Consultation completed",
        message: summary,
      },
    ],
  });

  // Tear down the Daily room (fire-and-forget; failures are non-fatal).
  if (consultation.meetingRoomId) {
    void deleteRoom(consultation.meetingRoomId);
  }

  return NextResponse.json({ consultation: updated });
}
