"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type PatientSettingsData = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    profileImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
  };
};

export async function getPatientSettings(): Promise<PatientSettingsData> {
  const authUser = await requireRole([UserRole.PATIENT]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      profileImageUrl: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return { user };
}

export type UpdateSettingsInput = {
  phoneNumber: string;
};

export async function updatePatientSettings(
  data: UpdateSettingsInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireRole([UserRole.PATIENT]);

    await prisma.user.update({
      where: { id: authUser.id },
      data: {
        phoneNumber: data.phoneNumber.trim() || null,
      },
    });

    revalidatePath("/patient/settings");
    return { success: true };
  } catch (error) {
    console.error("[updatePatientSettings]", error);
    return { success: false, error: "Failed to update settings" };
  }
}

export async function deactivatePatientAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const authUser = await requireRole([UserRole.PATIENT]);

    await prisma.user.update({
      where: { id: authUser.id },
      data: { isActive: false },
    });

    revalidatePath("/patient/settings");
    return { success: true };
  } catch (error) {
    console.error("[deactivatePatientAccount]", error);
    return { success: false, error: "Failed to deactivate account" };
  }
}
