"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import {
  UserRole,
  DoctorVerificationStatus,
  AppointmentType,
  AppointmentStatus,
} from "@/app/generated/prisma/enums";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type AvailableDoctor = {
  id: string;
  name: string;
  specialty: string | null;
  hospitalName: string | null;
  location: string | null;
  consultationFee: number;
  yearsOfExperience: number | null;
  bio: string | null;
  supportsVirtualConsultation: boolean;
  verificationStatus: string;
};

export type DoctorDetail = AvailableDoctor & {
  hospitalId: string | null;
};

export type TimeSlot = {
  /** ISO string of the slot start time (full timestamp, includes the date). */
  iso: string;
  /** Human-readable label, e.g. "4:30 PM". */
  label: string;
};

export type CreatedAppointment = {
  id: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentType: string;
  appointmentStatus: string;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const SLOT_LENGTH_MINUTES = 30;
const SLOT_STEP_MINUTES = 30;

/**
 * Combines a calendar `date` with a `Time`-column value (which Prisma returns
 * as a Date anchored at 1970-01-01) into a real timestamp for that date.
 */
function combineDateAndTime(date: Date, time: Date): Date {
  const out = new Date(date);
  out.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
  return out;
}

function formatTimeLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/* -------------------------------------------------------------------------- */
/*  Public actions                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Directory listing of bookable doctors.
 * Only verified doctors are exposed to patients.
 */
export async function getAvailableDoctors(): Promise<AvailableDoctor[]> {
  await requireRole([UserRole.PATIENT]);

  const doctors = await prisma.doctorProfile.findMany({
    where: {
      verificationStatus: DoctorVerificationStatus.VERIFIED,
    },
    select: {
      id: true,
      yearsOfExperience: true,
      bio: true,
      consultationFee: true,
      supportsVirtualConsultation: true,
      verificationStatus: true,
      specialization: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
      doctorHospitals: {
        take: 1,
        select: {
          hospital: {
            select: { id: true, name: true, city: true, state: true },
          },
        },
      },
    },
    orderBy: { user: { firstName: "asc" } },
  });

  return doctors.map((doc) => {
    const hospital = doc.doctorHospitals[0]?.hospital ?? null;
    return {
      id: doc.id,
      name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
      specialty: doc.specialization?.name ?? null,
      hospitalName: hospital?.name ?? null,
      location: hospital ? `${hospital.city}, ${hospital.state}` : null,
      consultationFee: doc.consultationFee
        ? Number(doc.consultationFee)
        : 0,
      yearsOfExperience: doc.yearsOfExperience,
      bio: doc.bio,
      supportsVirtualConsultation: doc.supportsVirtualConsultation,
      verificationStatus: doc.verificationStatus,
    };
  });
}

/**
 * Single doctor lookup for the booking page.
 * Returns null when the doctor is missing or not yet verified.
 */
export async function getDoctorById(doctorId: string): Promise<DoctorDetail | null> {
  await requireRole([UserRole.PATIENT]);

  const doc = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
    select: {
      id: true,
      yearsOfExperience: true,
      bio: true,
      consultationFee: true,
      supportsVirtualConsultation: true,
      verificationStatus: true,
      specialization: { select: { name: true } },
      user: { select: { firstName: true, lastName: true } },
      doctorHospitals: {
        take: 1,
        select: {
          hospital: {
            select: { id: true, name: true, city: true, state: true },
          },
        },
      },
    },
  });

  if (!doc || doc.verificationStatus !== DoctorVerificationStatus.VERIFIED) {
    return null;
  }

  const hospital = doc.doctorHospitals[0]?.hospital ?? null;
  return {
    id: doc.id,
    name: `Dr. ${doc.user.firstName} ${doc.user.lastName}`,
    specialty: doc.specialization?.name ?? null,
    hospitalName: hospital?.name ?? null,
    hospitalId: hospital?.id ?? null,
    location: hospital ? `${hospital.city}, ${hospital.state}` : null,
    consultationFee: doc.consultationFee ? Number(doc.consultationFee) : 0,
    yearsOfExperience: doc.yearsOfExperience,
    bio: doc.bio,
    supportsVirtualConsultation: doc.supportsVirtualConsultation,
    verificationStatus: doc.verificationStatus,
  };
}

/**
 * Generates bookable time slots for a given doctor on a given date.
 *
 * Slots are derived from the doctor's `AvailabilityRule` rows for that weekday,
 * then filtered to remove any that already overlap an existing non-cancelled
 * appointment. Past slots (earlier than "now") are also dropped.
 */
export async function getAvailableTimeSlots(
  doctorId: string,
  date: Date,
): Promise<TimeSlot[]> {
  await requireRole([UserRole.PATIENT]);

  // JS getDay(): 0 = Sunday ... 6 = Saturday.
  const dayOfWeek = date.getDay();

  const rules = await prisma.availabilityRule.findMany({
    where: { doctorId, dayOfWeek, isActive: true },
    select: { startTime: true, endTime: true },
    orderBy: { startTime: "asc" },
  });

  if (rules.length === 0) {
    return [];
  }

  // Build candidate slots for every active rule.
  const candidates: Date[] = [];
  const now = new Date();

  for (const rule of rules) {
    const periodStart = combineDateAndTime(date, rule.startTime);
    const periodEnd = combineDateAndTime(date, rule.endTime);

    let cursor = new Date(periodStart);
    while (cursor.getTime() + SLOT_LENGTH_MINUTES * 60_000 <= periodEnd.getTime()) {
      if (cursor.getTime() >= now.getTime()) {
        candidates.push(new Date(cursor));
      }
      cursor = new Date(cursor.getTime() + SLOT_STEP_MINUTES * 60_000);
    }
  }

  if (candidates.length === 0) {
    return [];
  }

  const earliest = candidates[0];
  const latest = new Date(
    candidates[candidates.length - 1].getTime() + SLOT_LENGTH_MINUTES * 60_000,
  );

  // Pull any existing appointment for this doctor on this date whose time
  // range overlaps the candidate window, so we can strike those slots.
  const conflicts = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: date,
      appointmentStatus: { not: AppointmentStatus.CANCELLED },
      appointmentStartTime: { lt: latest },
      appointmentEndTime: { gte: earliest },
    },
    select: { appointmentStartTime: true, appointmentEndTime: true },
  });

  const isOverlap = (slotStart: Date) => {
    const slotEnd = new Date(slotStart.getTime() + SLOT_LENGTH_MINUTES * 60_000);
    return conflicts.some((appt) => {
      const start = appt.appointmentStartTime;
      const end = appt.appointmentEndTime;
      return slotStart.getTime() < end.getTime() && slotEnd.getTime() > start.getTime();
    });
  };

  return candidates
    .filter((slot) => !isOverlap(slot))
    .map((slot) => ({
      iso: slot.toISOString(),
      label: formatTimeLabel(slot),
    }));
}

/* -------------------------------------------------------------------------- */
/*  Create appointment                                                        */
/* -------------------------------------------------------------------------- */

const createAppointmentSchema = z.object({
  doctorId: z.string().min(1),
  date: z.string().min(1), // ISO yyyy-mm-dd
  slotIso: z.string().min(1), // ISO timestamp returned by getAvailableTimeSlots
  type: z.enum(["video", "in-person"]),
  reason: z.string().min(3).max(500),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export type CreateAppointmentResult =
  | { ok: true; appointment: CreatedAppointment }
  | { ok: false; error: string };

/**
 * Books an appointment for the authenticated patient.
 *
 * Validates input, verifies the slot is still free (double-booking guard),
 * ensures a virtual booking is only made against a doctor who supports it,
 * and persists the row. The created appointment starts in PENDING status.
 */
export async function createAppointment(
  raw: CreateAppointmentInput,
): Promise<CreateAppointmentResult> {
  const parsed = createAppointmentSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Invalid booking details." };
  }

  const input = parsed.data;
  const authUser = await requireRole([UserRole.PATIENT]);

  const patient = await prisma.patientProfile.findUnique({
    where: { userId: authUser.id },
    select: { id: true },
  });

  if (!patient) {
    return { ok: false, error: "Patient profile not found." };
  }

  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: input.doctorId },
    select: {
      id: true,
      userId: true,
      verificationStatus: true,
      supportsVirtualConsultation: true,
      user: { select: { firstName: true, lastName: true } },
    },
  });

  if (!doctor || doctor.verificationStatus !== DoctorVerificationStatus.VERIFIED) {
    return { ok: false, error: "Selected doctor is unavailable." };
  }

  const appointmentType =
    input.type === "video" ? AppointmentType.VIRTUAL : AppointmentType.PHYSICAL;

  if (appointmentType === AppointmentType.VIRTUAL && !doctor.supportsVirtualConsultation) {
    return {
      ok: false,
      error: "This doctor does not support virtual consultations.",
    };
  }

  const slotStart = new Date(input.slotIso);
  const slotEnd = new Date(slotStart.getTime() + SLOT_LENGTH_MINUTES * 60_000);

  // Calendar date column — normalize to local midnight.
  const appointmentDate = new Date(slotStart);
  appointmentDate.setHours(0, 0, 0, 0);

  // Double-booking guard: re-check for an overlapping, non-cancelled appointment.
  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId: doctor.id,
      appointmentDate,
      appointmentStatus: { not: AppointmentStatus.CANCELLED },
      appointmentStartTime: { lt: slotEnd },
      appointmentEndTime: { gt: slotStart },
    },
    select: { id: true },
  });

  if (conflict) {
    return { ok: false, error: "That time slot was just taken. Please choose another." };
  }

  try {
    const created = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentType,
        appointmentStatus: AppointmentStatus.PENDING,
        appointmentDate,
        appointmentStartTime: slotStart,
        appointmentEndTime: slotEnd,
        reasonForVisit: input.reason,
        notes: input.notes ? input.notes : null,
      },
      select: {
        id: true,
        appointmentDate: true,
        appointmentStartTime: true,
        appointmentType: true,
        appointmentStatus: true,
      },
    });

    // Notify the doctor of the new booking.
    await prisma.notification.create({
      data: {
        userId: doctor.userId,
        type: "APPOINTMENT",
        title: "New appointment request",
        message: `New ${appointmentType === AppointmentType.VIRTUAL ? "virtual" : "in-person"} appointment request for ${formatTimeLabel(created.appointmentStartTime)}.`,
      },
    });

    revalidatePath("/patient/appointments");
    revalidatePath("/patient/dashboard");
    revalidatePath("/doctor/dashboard");

    return {
      ok: true,
      appointment: {
        id: created.id,
        doctorName: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
        appointmentDate: created.appointmentDate.toISOString(),
        appointmentStartTime: created.appointmentStartTime.toISOString(),
        appointmentType: created.appointmentType,
        appointmentStatus: created.appointmentStatus,
      },
    };
  } catch (error) {
    console.error("[createAppointment]", error);
    return { ok: false, error: "Failed to book the appointment. Please try again." };
  }
}
