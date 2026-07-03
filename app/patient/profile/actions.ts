"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type PatientProfileFormData = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    profileImageUrl: string | null;
  };
  patient: {
    id: string;
    dateOfBirth: Date | null;
    gender: string | null;
    address: string | null;
    bloodGroup: string | null;
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
  };
};

export async function getPatientProfileFormData(): Promise<PatientProfileFormData> {
  const authUser = await requireRole([UserRole.PATIENT]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      profileImageUrl: true,
      patientProfile: {
        select: {
          id: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          bloodGroup: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
        },
      },
    },
  });

  if (!user || !user.patientProfile) {
    throw new Error("Patient profile not found");
  }

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profileImageUrl: user.profileImageUrl,
    },
    patient: {
      id: user.patientProfile.id,
      dateOfBirth: user.patientProfile.dateOfBirth,
      gender: user.patientProfile.gender,
      address: user.patientProfile.address,
      bloodGroup: user.patientProfile.bloodGroup,
      emergencyContactName: user.patientProfile.emergencyContactName,
      emergencyContactPhone: user.patientProfile.emergencyContactPhone,
    },
  };
}

export type UpdatePatientProfileInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

export async function updatePatientProfile(
  data: UpdatePatientProfileInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireRole([UserRole.PATIENT]);

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { patientProfile: { select: { id: true } } },
    });

    if (!user?.patientProfile) {
      return { success: false, error: "Patient profile not found" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: authUser.id },
        data: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phoneNumber: data.phoneNumber.trim() || null,
        },
      });

      await tx.patientProfile.update({
        where: { id: user.patientProfile!.id },
        data: {
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          gender: data.gender || null,
          address: data.address.trim() || null,
          bloodGroup: data.bloodGroup || null,
          emergencyContactName: data.emergencyContactName.trim() || null,
          emergencyContactPhone: data.emergencyContactPhone.trim() || null,
        },
      });
    });

    revalidatePath("/patient/profile");
    revalidatePath("/patient/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[updatePatientProfile]", error);
    return { success: false, error: "Failed to update profile" };
  }
}
