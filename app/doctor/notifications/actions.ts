"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type DoctorNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export async function getDoctorNotifications(): Promise<DoctorNotification[]> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  return prisma.notification.findMany({
    where: { userId: authUser.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
  });
}

export async function markNotificationRead(
  notificationId: string,
): Promise<{ success: boolean }> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: authUser.id },
    data: { isRead: true },
  });

  revalidatePath("/doctor/notifications");
  return { success: true };
}

export async function markAllDoctorNotificationsRead(): Promise<{ success: boolean }> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  await prisma.notification.updateMany({
    where: { userId: authUser.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/doctor/notifications");
  revalidatePath("/doctor/dashboard");
  return { success: true };
}

export async function deleteNotification(
  notificationId: string,
): Promise<{ success: boolean }> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  await prisma.notification.deleteMany({
    where: { id: notificationId, userId: authUser.id },
  });

  revalidatePath("/doctor/notifications");
  return { success: true };
}
