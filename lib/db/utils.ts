import "server-only";

import { prisma } from "./prisma";
import {
  AppointmentStatus,
  MembershipStatus,
  NotificationType,
} from "@/app/generated/prisma/enums";
import type { Prisma } from "@/app/generated/prisma/client";

/* -------------------------------------------------------------------------- */
/*  Notification helper                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Creates a single in-app notification for a user.
 *
 * This helper centralises the `prisma.notification.create` calls that are
 * currently duplicated across the consultation-complete route, appointment
 * actions, and membership flows. All notification types from
 * `DATABASE_SCHEMA.md` (APPOINTMENT, CONSULTATION, MEMBERSHIP, SYSTEM) are
 * supported through the `NotificationType` enum.
 */
export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
    },
  });
}

/**
 * Bulk-creates notifications (e.g. notifying both patient and doctor after
 * a consultation completes). Prefer this over calling `createNotification` in a
 * loop when multiple records share the same shape.
 */
export async function createNotifications(
  notifications: Array<{
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
  }>,
) {
  if (notifications.length === 0) return;

  return prisma.notification.createMany({
    data: notifications,
  });
}

/* -------------------------------------------------------------------------- */
/*  Audit-log helper                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Records an immutable audit entry.
 *
 * DATABASE_SCHEMA.md specifies the tracked events:
 *   - Doctor Verified
 *   - Membership Activated
 *   - Appointment Cancelled
 *   - Consultation Completed
 *
 * `metadata` is stored as JSONB and can carry arbitrary context (e.g. the
 * previous status of a changed entity).
 */
export async function createAuditLog(params: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      metadata: params.metadata ?? undefined,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  User-with-profile lookup                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Resolves a user by Clerk ID together with their role-specific profile.
 *
 * This pattern is repeated in `lib/auth/current-user.ts`, `patient/dashboard/
 * actions.ts`, and `doctor/dashboard/actions.ts`. The returned shape depends
 * on the user's role:
 *
 * - PATIENT  → `patientProfile` is populated
 * - DOCTOR   → `doctorProfile` is populated
 * - ADMIN    → neither profile is populated (admins have no role-specific
 *              profile in the schema)
 *
 * Returns `null` when the user does not exist or is inactive.
 */
export async function getUserWithProfile(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId, isActive: true },
    select: {
      id: true,
      clerkId: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      role: true,
      profileImageUrl: true,
      isActive: true,
      patientProfile: {
        select: {
          id: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          bloodGroup: true,
        },
      },
      doctorProfile: {
        select: {
          id: true,
          specializationId: true,
          verificationStatus: true,
          licenseNumber: true,
          yearsOfExperience: true,
          bio: true,
          consultationFee: true,
          supportsVirtualConsultation: true,
          profileCompleted: true,
        },
      },
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  Membership helpers                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Returns the patient's most-recently-started active membership subscription,
 * or `null` when no active subscription exists.
 *
 * This enforces the DATABASE_SCHEMA.md invariant:
 *   "Only active memberships may access healthcare services."
 *
 * Callers should gate appointment-creation and consultation-scheduling on
 * the result of this helper.
 */
export async function findActiveSubscription(patientId: string) {
  return prisma.membershipSubscription.findFirst({
    where: {
      patientId,
      status: MembershipStatus.ACTIVE,
    },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      status: true,
      startDate: true,
      endDate: true,
      autoRenew: true,
      membershipPlan: {
        select: {
          id: true,
          name: true,
          consultationLimit: true,
          supportsVirtualConsultation: true,
        },
      },
    },
  });
}

/* -------------------------------------------------------------------------- */
/*  Availability / double-booking helpers                                       */
/* -------------------------------------------------------------------------- */

/**
 * Checks whether a time slot is still free for a doctor on a given date.
 *
 * This is the double-booking prevention query extracted from
 * `patient/appointments/actions.ts:createAppointment`. It checks for any
 * non-cancelled appointment whose time range overlaps the proposed window:
 *
 *   conflict exists when: existingStart < proposedEnd AND existingEnd > proposedStart
 *
 * Returns `true` if the slot is available (no conflict), `false` otherwise.
 */
export async function isSlotAvailable(params: {
  doctorId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
}): Promise<boolean> {
  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId: params.doctorId,
      appointmentDate: params.date,
      appointmentStatus: { not: AppointmentStatus.CANCELLED },
      appointmentStartTime: { lt: params.endTime },
      appointmentEndTime: { gt: params.startTime },
    },
    select: { id: true },
  });

  return conflict === null;
}
