"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole, AppointmentStatus } from "@/app/generated/prisma/enums";

export type MedicalHistoryAppointment = {
  id: string;
  doctorName: string;
  specialization: string | null;
  hospitalName: string;
  appointmentDate: Date;
  appointmentType: string;
  appointmentStatus: string;
  reasonForVisit: string;
  notes: string | null;
  consultation: {
    diagnosis: string | null;
    symptoms: string | null;
    recommendations: string | null;
    followUpRequired: boolean;
    followUpNotes: string | null;
  } | null;
};

export type MedicalHistoryData = {
  appointments: MedicalHistoryAppointment[];
  totalVisits: number;
  doctorsCount: number;
  lastVisitDate: Date | null;
};

export async function getPatientMedicalHistory(): Promise<MedicalHistoryData> {
  const authUser = await requireRole([UserRole.PATIENT]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      patientProfile: {
        select: { id: true },
      },
    },
  });

  if (!user?.patientProfile) {
    throw new Error("Patient profile not found");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: user.patientProfile.id,
      appointmentStatus: {
        in: [
          AppointmentStatus.COMPLETED,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.PENDING,
          AppointmentStatus.CANCELLED,
          AppointmentStatus.NO_SHOW,
        ],
      },
    },
    orderBy: { appointmentDate: "desc" },
    select: {
      id: true,
      appointmentDate: true,
      appointmentType: true,
      appointmentStatus: true,
      reasonForVisit: true,
      notes: true,
      doctor: {
        select: {
          user: { select: { firstName: true, lastName: true } },
          specialization: { select: { name: true } },
        },
      },
      hospital: {
        select: { name: true },
      },
      consultation: {
        select: {
          diagnosis: true,
          symptoms: true,
          recommendations: true,
          followUpRequired: true,
          followUpNotes: true,
        },
      },
    },
  });

  // Count unique doctors
  const uniqueDoctorIds = new Set<string>();
  for (const apt of appointments) {
    uniqueDoctorIds.add(`${apt.doctor.user.firstName}-${apt.doctor.user.lastName}`);
  }

  const completedApts = appointments.filter(
    (a) => a.appointmentStatus === AppointmentStatus.COMPLETED,
  );
  const lastVisitDate = completedApts.length > 0 ? completedApts[0].appointmentDate : null;

  return {
    appointments: appointments.map((apt) => ({
      id: apt.id,
      doctorName: `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`,
      specialization: apt.doctor.specialization?.name ?? null,
      hospitalName: apt.hospital?.name ?? "Virtual Consultation",
      appointmentDate: apt.appointmentDate,
      appointmentType: apt.appointmentType,
      appointmentStatus: apt.appointmentStatus,
      reasonForVisit: apt.reasonForVisit,
      notes: apt.notes,
      consultation: apt.consultation,
    })),
    totalVisits: completedApts.length,
    doctorsCount: uniqueDoctorIds.size,
    lastVisitDate,
  };
}
