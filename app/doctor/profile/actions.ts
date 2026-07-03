"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type DoctorProfileFormData = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
    phoneNumber: string | null;
  };
  doctor: {
    id: string;
    specializationId: string | null;
    specializationName: string | null;
    licenseNumber: string | null;
    yearsOfExperience: number | null;
    bio: string | null;
    consultationFee: number | null;
    supportsVirtualConsultation: boolean;
    verificationStatus: string;
    profileCompleted: boolean;
  };
  specializations: { id: string; name: string }[];
  hospitals: { id: string; name: string; city: string; state: string }[];
  linkedHospitalIds: string[];
};

export async function getProfileFormData(): Promise<DoctorProfileFormData> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  const [user, specializations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        profileImageUrl: true,
        phoneNumber: true,
        doctorProfile: {
          select: {
            id: true,
            specializationId: true,
            licenseNumber: true,
            yearsOfExperience: true,
            bio: true,
            consultationFee: true,
            supportsVirtualConsultation: true,
            verificationStatus: true,
            profileCompleted: true,
            specialization: { select: { name: true } },
            doctorHospitals: {
              select: { hospitalId: true },
            },
          },
        },
      },
    }),
    prisma.specialization.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!user || !user.doctorProfile) {
    throw new Error("Doctor profile not found");
  }

  const hospitals = await prisma.hospital.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, city: true, state: true },
  });

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
    },
    doctor: {
      id: user.doctorProfile.id,
      specializationId: user.doctorProfile.specializationId,
      specializationName: user.doctorProfile.specialization?.name ?? null,
      licenseNumber: user.doctorProfile.licenseNumber,
      yearsOfExperience: user.doctorProfile.yearsOfExperience,
      bio: user.doctorProfile.bio,
      consultationFee: user.doctorProfile.consultationFee
        ? Number(user.doctorProfile.consultationFee)
        : null,
      supportsVirtualConsultation:
        user.doctorProfile.supportsVirtualConsultation,
      verificationStatus: user.doctorProfile.verificationStatus,
      profileCompleted: user.doctorProfile.profileCompleted,
    },
    specializations,
    hospitals,
    linkedHospitalIds: user.doctorProfile.doctorHospitals.map(
      (dh) => dh.hospitalId,
    ),
  };
}

export type UpdateDoctorProfileInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  specializationId: string;
  licenseNumber: string;
  yearsOfExperience: number;
  consultationFee: number;
  supportsVirtualConsultation: boolean;
  hospitalIds: string[];
};

export async function updateDoctorProfile(
  data: UpdateDoctorProfileInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const authUser = await requireRole([UserRole.DOCTOR]);

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { doctorProfile: { select: { id: true } } },
    });

    if (!user?.doctorProfile) {
      return { success: false, error: "Doctor profile not found" };
    }

    const doctorId = user.doctorProfile.id;

    await prisma.$transaction(async (tx) => {
      // Update user basic info
      await tx.user.update({
        where: { id: authUser.id },
        data: {
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phoneNumber: data.phoneNumber.trim() || null,
        },
      });

      // Update doctor profile
      await tx.doctorProfile.update({
        where: { id: doctorId },
        data: {
          bio: data.bio.trim() || null,
          specializationId: data.specializationId || null,
          licenseNumber: data.licenseNumber.trim() || null,
          yearsOfExperience: data.yearsOfExperience || null,
          consultationFee: data.consultationFee || null,
          supportsVirtualConsultation: data.supportsVirtualConsultation,
          profileCompleted: true,
        },
      });

      // Sync hospital links
      if (data.hospitalIds.length > 0) {
        await tx.doctorHospital.deleteMany({ where: { doctorId } });
        await tx.doctorHospital.createMany({
          data: data.hospitalIds.map((hospitalId) => ({
            doctorId,
            hospitalId,
          })),
          skipDuplicates: true,
        });
      }
    });

    revalidatePath("/doctor/profile");
    revalidatePath("/doctor/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[updateDoctorProfile]", error);
    return { success: false, error: "Failed to update profile" };
  }
}
