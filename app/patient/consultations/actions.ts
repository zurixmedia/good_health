import "server-only";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { ensureRoomForAppointment } from "@/lib/daily";

export type ConsultationSummary = {
  id: string;
  status: string;
  meetingProvider: string;
  meetingRoomId: string | null;
  meetingUrl: string | null;
  doctorName: string;
  specialty: string | null;
  patientName: string;
  appointmentId: string;
  appointmentDate: Date;
  appointmentStartTime: Date;
  appointmentStatus: string;
  reasonForVisit: string;
  symptoms: string | null;
  diagnosis: string | null;
  recommendations: string | null;
  followUpRequired: boolean;
  followUpNotes: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  /** True when the viewer is the assigned doctor. */
  isDoctor: boolean;
};

function formatName(first: string, last: string, prefix = "") {
  return `${prefix} ${first} ${last}`.trim();
}

/**
 * All consultations visible to the current user (patient or doctor), with the
 * underlying appointment and parties. Only rows where the caller is the
 * assigned patient or doctor are returned.
 */
export async function getMyConsultations(): Promise<ConsultationSummary[]> {
  const authUser = await requireRole([UserRole.PATIENT, UserRole.DOCTOR]);

  const rows = await prisma.consultation.findMany({
    where: {
      OR: [
        { appointment: { patient: { userId: authUser.id } } },
        { appointment: { doctor: { userId: authUser.id } } },
      ],
    },
    orderBy: { appointment: { appointmentDate: "desc" } },
    select: {
      id: true,
      status: true,
      meetingProvider: true,
      meetingRoomId: true,
      meetingUrl: true,
      symptoms: true,
      diagnosis: true,
      recommendations: true,
      followUpRequired: true,
      followUpNotes: true,
      startedAt: true,
      endedAt: true,
      appointment: {
        select: {
          id: true,
          appointmentDate: true,
          appointmentStartTime: true,
          appointmentStatus: true,
          reasonForVisit: true,
          patient: {
            select: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          doctor: {
            select: {
              userId: true,
              specialization: { select: { name: true } },
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    meetingProvider: row.meetingProvider,
    meetingRoomId: row.meetingRoomId,
    meetingUrl: row.meetingUrl,
    doctorName: formatName(
      row.appointment.doctor.user.firstName,
      row.appointment.doctor.user.lastName,
      "Dr.",
    ),
    specialty: row.appointment.doctor.specialization?.name ?? null,
    patientName: formatName(
      row.appointment.patient.user.firstName,
      row.appointment.patient.user.lastName,
    ),
    appointmentId: row.appointment.id,
    appointmentDate: row.appointment.appointmentDate,
    appointmentStartTime: row.appointment.appointmentStartTime,
    appointmentStatus: row.appointment.appointmentStatus,
    reasonForVisit: row.appointment.reasonForVisit,
    symptoms: row.symptoms,
    diagnosis: row.diagnosis,
    recommendations: row.recommendations,
    followUpRequired: row.followUpRequired,
    followUpNotes: row.followUpNotes,
    startedAt: row.startedAt,
    endedAt: row.endedAt,
    isDoctor: row.appointment.doctor.user.id === authUser.id,
  }));
}

/**
 * Single consultation lookup for the room page. Returns null if the row is
 * missing or the caller isn't a participant.
 *
 * If the consultation exists but has no room yet (e.g. legacy row, or the
 * create-room endpoint hasn't run), one is provisioned lazily so the join
 * button always works.
 */
export async function getConsultationForRoom(
  consultationId: string,
): Promise<ConsultationSummary | null> {
  const authUser = await requireRole([UserRole.PATIENT, UserRole.DOCTOR]);

  const row = await prisma.consultation.findUnique({
    where: { id: consultationId },
    select: {
      id: true,
      status: true,
      meetingProvider: true,
      meetingRoomId: true,
      meetingUrl: true,
      symptoms: true,
      diagnosis: true,
      recommendations: true,
      followUpRequired: true,
      followUpNotes: true,
      startedAt: true,
      endedAt: true,
      appointment: {
        select: {
          id: true,
          appointmentDate: true,
          appointmentStartTime: true,
          appointmentStatus: true,
          reasonForVisit: true,
          patient: {
            select: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
          doctor: {
            select: {
              userId: true,
              specialization: { select: { name: true } },
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      },
    },
  });

  if (!row) return null;

  const isDoctor = row.appointment.doctor.user.id === authUser.id;
  const isPatient = row.appointment.patient.user.id === authUser.id;
  if (!isDoctor && !isPatient) return null;

  // Lazily provision a room if the consultation row predates the integration.
  let meetingRoomId = row.meetingRoomId;
  let meetingUrl = row.meetingUrl;
  if (!meetingRoomId || !meetingUrl) {
    try {
      const room = await ensureRoomForAppointment(row.appointment.id);
      meetingRoomId = room.name;
      meetingUrl = room.url;
      await prisma.consultation.update({
        where: { id: row.id },
        data: {
          meetingProvider: "daily",
          meetingRoomId: meetingRoomId,
          meetingUrl: meetingUrl,
        },
      });
    } catch (error) {
      console.error("[getConsultationForRoom] lazy room provisioning failed", error);
    }
  }

  return {
    id: row.id,
    status: row.status,
    meetingProvider: row.meetingProvider,
    meetingRoomId: meetingRoomId,
    meetingUrl: meetingUrl,
    doctorName: formatName(
      row.appointment.doctor.user.firstName,
      row.appointment.doctor.user.lastName,
      "Dr.",
    ),
    specialty: row.appointment.doctor.specialization?.name ?? null,
    patientName: formatName(
      row.appointment.patient.user.firstName,
      row.appointment.patient.user.lastName,
    ),
    appointmentId: row.appointment.id,
    appointmentDate: row.appointment.appointmentDate,
    appointmentStartTime: row.appointment.appointmentStartTime,
    appointmentStatus: row.appointment.appointmentStatus,
    reasonForVisit: row.appointment.reasonForVisit,
    symptoms: row.symptoms,
    diagnosis: row.diagnosis,
    recommendations: row.recommendations,
    followUpRequired: row.followUpRequired,
    followUpNotes: row.followUpNotes,
    startedAt: row.startedAt,
    endedAt: row.endedAt,
    isDoctor,
  };
}
