"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import {
  UserRole,
  AppointmentStatus,
} from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type DoctorAppointment = {
  id: string;
  patientName: string;
  patientInitials: string;
  patientEmail: string;
  patientPhone: string | null;
  patientGender: string | null;
  patientBloodGroup: string | null;
  reasonForVisit: string;
  notes: string | null;
  appointmentDate: Date;
  appointmentStartTime: Date;
  appointmentEndTime: Date;
  appointmentStatus: string;
  appointmentType: string;
  hospitalName: string | null;
  hospitalLocation: string | null;
  consultationId: string | null;
  consultationUrl: string | null;
  createdAt: Date;
};

export async function getDoctorAppointments(): Promise<DoctorAppointment[]> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId: authUser.id },
    select: { id: true },
  });

  if (!doctorProfile) throw new Error("Doctor profile not found");

  const rows = await prisma.appointment.findMany({
    where: { doctorId: doctorProfile.id },
    orderBy: [{ appointmentDate: "desc" }, { appointmentStartTime: "asc" }],
    select: {
      id: true,
      reasonForVisit: true,
      notes: true,
      appointmentDate: true,
      appointmentStartTime: true,
      appointmentEndTime: true,
      appointmentStatus: true,
      appointmentType: true,
      createdAt: true,
      hospital: { select: { name: true, city: true, state: true } },
      patient: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          gender: true,
          bloodGroup: true,
        },
      },
      consultation: { select: { id: true, meetingUrl: true } },
    },
  });

  return rows.map((apt) => ({
    id: apt.id,
    patientName: `${apt.patient.user.firstName} ${apt.patient.user.lastName}`,
    patientInitials: `${apt.patient.user.firstName[0]}${apt.patient.user.lastName[0]}`.toUpperCase(),
    patientEmail: apt.patient.user.email,
    patientPhone: apt.patient.user.phoneNumber,
    patientGender: apt.patient.gender,
    patientBloodGroup: apt.patient.bloodGroup,
    reasonForVisit: apt.reasonForVisit,
    notes: apt.notes,
    appointmentDate: apt.appointmentDate,
    appointmentStartTime: apt.appointmentStartTime,
    appointmentEndTime: apt.appointmentEndTime,
    appointmentStatus: apt.appointmentStatus,
    appointmentType: apt.appointmentType,
    hospitalName: apt.hospital?.name ?? null,
    hospitalLocation: apt.hospital
      ? `${apt.hospital.city}, ${apt.hospital.state}`
      : null,
    consultationId: apt.consultation?.id ?? null,
    consultationUrl: apt.consultation?.meetingUrl ?? null,
    createdAt: apt.createdAt,
  }));
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireRole([UserRole.DOCTOR]);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        id: true,
        appointmentStatus: true,
        doctor: { select: { userId: true } },
        patient: {
          select: { userId: true },
        },
      },
    });

    if (!appointment) return { success: false, error: "Appointment not found" };
    if (appointment.doctor.userId !== authUser.id)
      return { success: false, error: "Unauthorized" };

    await prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { appointmentStatus: status },
      });

      // Notify patient
      const notifMessages: Record<string, { title: string; message: string }> = {
        CONFIRMED: {
          title: "Appointment Confirmed",
          message: "Your appointment has been confirmed by the doctor.",
        },
        CANCELLED: {
          title: "Appointment Cancelled",
          message: "Your appointment has been cancelled by the doctor.",
        },
        COMPLETED: {
          title: "Appointment Completed",
          message:
            "Your appointment has been marked as completed. We hope you are feeling better!",
        },
        NO_SHOW: {
          title: "Appointment No-Show",
          message: "You were marked as a no-show for your appointment.",
        },
      };

      const notif = notifMessages[status];
      if (notif) {
        await tx.notification.create({
          data: {
            userId: appointment.patient.userId,
            type: "APPOINTMENT",
            title: notif.title,
            message: notif.message,
          },
        });
      }
    });

    revalidatePath("/doctor/appointments");
    revalidatePath("/doctor/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[updateAppointmentStatus]", error);
    return { success: false, error: "Failed to update appointment" };
  }
}


