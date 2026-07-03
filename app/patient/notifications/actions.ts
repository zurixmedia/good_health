"use server";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";

export type PatientNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export async function getPatientNotifications(): Promise<PatientNotification[]> {
  const authUser = await requireRole([UserRole.PATIENT]);

  const notifications = await prisma.notification.findMany({
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

  return notifications;
}

export async function markNotificationRead(
  notificationId: string,
): Promise<{ success: boolean }> {
  const authUser = await requireRole([UserRole.PATIENT]);

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: authUser.id },
    data: { isRead: true },
  });

  revalidatePath("/patient/notifications");
  return { success: true };
}

export async function markAllNotificationsRead(): Promise<{
  success: boolean;
}> {
  const authUser = await requireRole([UserRole.PATIENT]);

  await prisma.notification.updateMany({
    where: { userId: authUser.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/patient/notifications");
  return { success: true };
}

export async function deleteNotification(
  notificationId: string,
): Promise<{ success: boolean }> {
  const authUser = await requireRole([UserRole.PATIENT]);

  await prisma.notification.deleteMany({
    where: { id: notificationId, userId: authUser.id },
  });

  revalidatePath("/patient/notifications");
  return { success: true };
}
