import "server-only";

import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/db/prisma";
import type { AuthenticatedUser } from "@/types/auth";

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      id: true,
      clerkId: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}
