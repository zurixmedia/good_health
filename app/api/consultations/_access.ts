import "server-only";

import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import { AppointmentStatus } from "@/app/generated/prisma/enums";

/**
 * Resolves a consultation by id and confirms the caller is the assigned
 * patient or doctor. Returns the consultation (with its appointment + parties)
 * on success, or null if it doesn't exist or the caller has no access.
 *
 * Shared by the join / complete consultation routes.
 */
export type AuthorizedConsultation = {
  id: string;
  status: string;
  meetingProvider: string;
  meetingRoomId: string | null;
  meetingUrl: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  appointment: {
    id: string;
    appointmentStatus: string;
    appointmentType: string;
    patientId: string;
    doctorId: string;
    patient: { user: { id: string; firstName: string; lastName: string } };
    doctor: {
      userId: string;
      user: { id: string; firstName: string; lastName: string };
    };
  };
};

export async function getAuthorizedConsultation(
  consultationId: string,
): Promise<{ consultation: AuthorizedConsultation; role: "PATIENT" | "DOCTOR" } | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
    select: {
      id: true,
      status: true,
      meetingProvider: true,
      meetingRoomId: true,
      meetingUrl: true,
      startedAt: true,
      endedAt: true,
      appointment: {
        select: {
          id: true,
          appointmentStatus: true,
          appointmentType: true,
          patientId: true,
          doctorId: true,
          patient: {
            select: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          doctor: {
            select: {
              userId: true,
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      },
    },
  });

  if (!consultation) return null;

  const isPatient = consultation.appointment.patient.user.id === user.id;
  const isDoctor = consultation.appointment.doctor.user.id === user.id;

  if (!isPatient && !isDoctor) return null;

  return {
    consultation: consultation as AuthorizedConsultation,
    role: isDoctor ? "DOCTOR" : "PATIENT",
  };
}

/**
 * True when the underlying appointment is in a state that permits a live call
 * (confirmed or still active; not cancelled/no-show/completed).
 */
export function isAppointmentJoinable(appointmentStatus: string): boolean {
  return (
    appointmentStatus === AppointmentStatus.CONFIRMED ||
    appointmentStatus === AppointmentStatus.PENDING
  );
}
