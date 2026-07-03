"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type PatientRecord = {
  patientId: string;
  patientName: string;
  patientInitials: string;
  patientEmail: string;
  patientGender: string | null;
  patientBloodGroup: string | null;
  patientDateOfBirth: Date | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  totalAppointments: number;
  lastVisit: Date | null;
  consultations: {
    id: string;
    appointmentId: string;
    appointmentDate: Date;
    reasonForVisit: string;
    appointmentType: string;
    appointmentStatus: string;
    symptoms: string | null;
    diagnosis: string | null;
    recommendations: string | null;
    followUpRequired: boolean;
    followUpNotes: string | null;
  }[];
};

export async function getDoctorPatients(
  query?: string,
): Promise<PatientRecord[]> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: authUser.id },
    select: { id: true },
  });

  if (!doctorProfile) throw new Error("Doctor profile not found");

  // Get unique patients who have booked with this doctor
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctorProfile.id,
      ...(query
        ? {
            patient: {
              user: {
                OR: [
                  { firstName: { contains: query, mode: "insensitive" } },
                  { lastName: { contains: query, mode: "insensitive" } },
                  { email: { contains: query, mode: "insensitive" } },
                ],
              },
            },
          }
        : {}),
    },
    orderBy: { appointmentDate: "desc" },
    select: {
      id: true,
      reasonForVisit: true,
      appointmentDate: true,
      appointmentType: true,
      appointmentStatus: true,
      patient: {
        select: {
          id: true,
          dateOfBirth: true,
          gender: true,
          bloodGroup: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      consultation: {
        select: {
          id: true,
          symptoms: true,
          diagnosis: true,
          recommendations: true,
          followUpRequired: true,
          followUpNotes: true,
        },
      },
    },
  });

  // Group by patient
  const patientMap = new Map<string, PatientRecord>();

  for (const apt of appointments) {
    const pid = apt.patient.id;
    if (!patientMap.has(pid)) {
      patientMap.set(pid, {
        patientId: pid,
        patientName: `${apt.patient.user.firstName} ${apt.patient.user.lastName}`,
        patientInitials: `${apt.patient.user.firstName[0]}${apt.patient.user.lastName[0]}`.toUpperCase(),
        patientEmail: apt.patient.user.email,
        patientGender: apt.patient.gender,
        patientBloodGroup: apt.patient.bloodGroup,
        patientDateOfBirth: apt.patient.dateOfBirth,
        emergencyContactName: apt.patient.emergencyContactName,
        emergencyContactPhone: apt.patient.emergencyContactPhone,
        totalAppointments: 0,
        lastVisit: null,
        consultations: [],
      });
    }

    const record = patientMap.get(pid)!;
    record.totalAppointments += 1;

    if (!record.lastVisit || apt.appointmentDate > record.lastVisit) {
      record.lastVisit = apt.appointmentDate;
    }

    record.consultations.push({
      id: apt.consultation?.id ?? apt.id,
      appointmentId: apt.id,
      appointmentDate: apt.appointmentDate,
      reasonForVisit: apt.reasonForVisit,
      appointmentType: apt.appointmentType,
      appointmentStatus: apt.appointmentStatus,
      symptoms: apt.consultation?.symptoms ?? null,
      diagnosis: apt.consultation?.diagnosis ?? null,
      recommendations: apt.consultation?.recommendations ?? null,
      followUpRequired: apt.consultation?.followUpRequired ?? false,
      followUpNotes: apt.consultation?.followUpNotes ?? null,
    });
  }

  return Array.from(patientMap.values());
}

export async function addClinicalNote(input: {
  appointmentId: string;
  symptoms: string;
  diagnosis: string;
  recommendations: string;
  followUpRequired: boolean;
  followUpNotes: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireRole([UserRole.DOCTOR]);

    const appointment = await prisma.appointment.findUnique({
      where: { id: input.appointmentId },
      select: {
        id: true,
        doctor: { select: { userId: true } },
        consultation: { select: { id: true } },
      },
    });

    if (!appointment) return { success: false, error: "Appointment not found" };
    if (appointment.doctor.userId !== authUser.id)
      return { success: false, error: "Unauthorized" };

    if (appointment.consultation) {
      await prisma.consultation.update({
        where: { id: appointment.consultation.id },
        data: {
          symptoms: input.symptoms || null,
          diagnosis: input.diagnosis || null,
          recommendations: input.recommendations || null,
          followUpRequired: input.followUpRequired,
          followUpNotes: input.followUpNotes || null,
        },
      });
    } else {
      // Create a stub consultation with clinical note
      await prisma.consultation.create({
        data: {
          appointmentId: input.appointmentId,
          meetingProvider: "manual",
          meetingRoomId: "",
          meetingUrl: "",
          symptoms: input.symptoms || null,
          diagnosis: input.diagnosis || null,
          recommendations: input.recommendations || null,
          followUpRequired: input.followUpRequired,
          followUpNotes: input.followUpNotes || null,
          status: "COMPLETED",
        },
      });
    }

    revalidatePath("/doctor/medical-history");
    return { success: true };
  } catch (error) {
    console.error("[addClinicalNote]", error);
    return { success: false, error: "Failed to save clinical note" };
  }
}
