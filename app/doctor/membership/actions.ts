"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type DoctorMembershipTier = "STANDARD" | "PREMIUM";

export type DoctorSubscriptionData = {
  currentTier: DoctorMembershipTier;
  since: Date | null;
  doctorName: string;
  verificationStatus: string;
};

export async function getDoctorSubscription(): Promise<DoctorSubscriptionData> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      firstName: true,
      lastName: true,
      doctorProfile: {
        select: {
          verificationStatus: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user?.doctorProfile) throw new Error("Doctor profile not found");

  // We use verificationStatus as a proxy for the tier:
  // VERIFIED = STANDARD, anything special we can extend later.
  // In a real system this would be its own table.
  const currentTier: DoctorMembershipTier = "STANDARD";

  return {
    currentTier,
    since: user.doctorProfile.createdAt,
    doctorName: `Dr. ${user.firstName} ${user.lastName}`,
    verificationStatus: user.doctorProfile.verificationStatus,
  };
}

export async function upgradeDoctorMembership(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const authUser = await requireRole([UserRole.DOCTOR]);

    // In a real system, this would charge via Stripe and update a subscription record.
    // For now, we notify the doctor that the upgrade request is received.
    await prisma.notification.create({
      data: {
        userId: authUser.id,
        type: "MEMBERSHIP",
        title: "Premium Upgrade Requested",
        message:
          "Your Premium Provider upgrade has been received. Our team will activate it within 24 hours.",
      },
    });

    revalidatePath("/doctor/membership");
    return { success: true };
  } catch (error) {
    console.error("[upgradeDoctorMembership]", error);
    return { success: false, error: "Failed to process upgrade" };
  }
}
