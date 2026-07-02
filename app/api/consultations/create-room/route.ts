import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ensureRoomForAppointment } from "@/lib/daily";
import {
  AppointmentType,
  AppointmentStatus,
  ConsultationStatus,
} from "@/app/generated/prisma/enums";

/**
 * POST /api/consultations/create-room
 * Body: { appointmentId: string }
 *
 * Provisions (idempotently) a private Daily.co room for a VIRTUAL appointment
 * and persists the corresponding Consultation row in SCHEDULED status. Only
 * the patient or doctor of the appointment may trigger this.
 *
 * Returns the consultation id + room metadata. If a Consultation already
 * exists for the appointment, it is returned as-is.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { appointmentId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const appointmentId = typeof body.appointmentId === "string" ? body.appointmentId : null;
  if (!appointmentId) {
    return NextResponse.json({ error: "appointmentId is required" }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: {
      id: true,
      appointmentType: true,
      appointmentStatus: true,
      patientId: true,
      doctorId: true,
      patient: {
        select: { user: { select: { id: true } } },
      },
      doctor: {
        select: { user: { select: { id: true } } },
      },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const isPatient = appointment.patient.user.id === user.id;
  const isDoctor = appointment.doctor.user.id === user.id;
  if (!isPatient && !isDoctor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (appointment.appointmentType !== AppointmentType.VIRTUAL) {
    return NextResponse.json(
      { error: "Only virtual appointments can have a consultation room" },
      { status: 400 },
    );
  }

  if (appointment.appointmentStatus === AppointmentStatus.CANCELLED) {
    return NextResponse.json(
      { error: "Cannot open a room for a cancelled appointment" },
      { status: 400 },
    );
  }

  // Return the existing consultation if one is already provisioned.
  const existing = await prisma.consultation.findUnique({
    where: { appointmentId },
    select: {
      id: true,
      status: true,
      meetingProvider: true,
      meetingRoomId: true,
      meetingUrl: true,
    },
  });
  if (existing) {
    return NextResponse.json({ consultation: existing });
  }

  try {
    const room = await ensureRoomForAppointment(appointmentId);

    const created = await prisma.consultation.create({
      data: {
        appointmentId,
        status: ConsultationStatus.SCHEDULED,
        meetingProvider: "daily",
        meetingRoomId: room.name,
        meetingUrl: room.url,
      },
      select: {
        id: true,
        status: true,
        meetingProvider: true,
        meetingRoomId: true,
        meetingUrl: true,
      },
    });

    return NextResponse.json({ consultation: created });
  } catch (error) {
    console.error("[create-room]", error);
    const message =
      error instanceof Error ? error.message : "Failed to create room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
