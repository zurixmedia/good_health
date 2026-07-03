"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type DoctorSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  newBookingAlerts: boolean;
  cancellationAlerts: boolean;
  consultationReminders: boolean;
  marketingEmails: boolean;
  allowVirtualConsultation: boolean;
  twoFactorEnabled: boolean;
};

// Default settings — in a real system this would be a DB table
const DEFAULT_SETTINGS: DoctorSettings = {
  emailNotifications: true,
  smsNotifications: false,
  appointmentReminders: true,
  newBookingAlerts: true,
  cancellationAlerts: true,
  consultationReminders: true,
  marketingEmails: false,
  allowVirtualConsultation: true,
  twoFactorEnabled: false,
};

export async function getDoctorSettings(): Promise<DoctorSettings & { email: string; firstName: string; lastName: string; supportsVirtual: boolean }> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      doctorProfile: {
        select: { supportsVirtualConsultation: true },
      },
    },
  });

  if (!user) throw new Error("User not found");

  return {
    ...DEFAULT_SETTINGS,
    allowVirtualConsultation: user.doctorProfile?.supportsVirtualConsultation ?? false,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    supportsVirtual: user.doctorProfile?.supportsVirtualConsultation ?? false,
  };
}

export async function saveSettings(
  settings: Partial<DoctorSettings>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireRole([UserRole.DOCTOR]);

    // If virtual consultation setting changed, persist to DoctorProfile
    if (settings.allowVirtualConsultation !== undefined) {
      await prisma.doctorProfile.updateMany({
        where: { userId: authUser.id },
        data: {
          supportsVirtualConsultation: settings.allowVirtualConsultation,
        },
      });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: authUser.id,
        action: "UPDATE_SETTINGS",
        entityType: "DoctorSettings",
        entityId: authUser.id,
        metadata: settings as any,
      },
    });

    revalidatePath("/doctor/settings");
    return { success: true };
  } catch (error) {
    console.error("[saveSettings]", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireRole([UserRole.DOCTOR]);

    await prisma.notification.create({
      data: {
        userId: authUser.id,
        type: "SYSTEM",
        title: "Account Deletion Requested",
        message: "Your account deletion request has been received. Our team will process it within 7 business days.",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[deleteAccount]", error);
    return { success: false, error: "Failed to submit deletion request" };
  }
}
