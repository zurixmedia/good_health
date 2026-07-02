import "server-only";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { ensureRoomForAppointment } from "@/lib/daily";

export type DoctorConsultationSummary = {
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
};

function formatName(first: string, last: string, prefix = "") {
  return `${prefix} ${first} ${last}`.trim();
}

/**
 * All consultations for the current doctor, with the underlying appointment
 * and patient info. Ordered by appointment date descending.
 */
export async function getDoctorConsultations(): Promise<DoctorConsultationSummary[]> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  const rows = await prisma.consultation.findMany({
    where: {
      appointment: { doctor: { userId: authUser.id } },
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
  }));
}

/**
 * Single consultation lookup for the doctor room page. Returns null if the
 * row is missing or the caller isn't the assigned doctor.
 *
 * Lazily provisions a room if the consultation exists but has none yet.
 */
export async function getDoctorConsultationForRoom(
  consultationId: string,
): Promise<DoctorConsultationSummary | null> {
  const authUser = await requireRole([UserRole.DOCTOR]);

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

  if (row.appointment.doctor.user.id !== authUser.id) return null;

  // Lazily provision a room if missing.
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
      console.error(
        "[getDoctorConsultationForRoom] lazy room provisioning failed",
        error,
      );
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
  };
}
