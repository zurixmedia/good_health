import "server-only";

import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/current-user";
import { hasPermission } from "@/lib/permissions/permissions";
import type { AppRole, AuthenticatedUser, Permission } from "@/types/auth";

export async function requireAuthentication(): Promise<AuthenticatedUser> {
  const clerkAuth = await auth();

  if (!clerkAuth.userId) {
    clerkAuth.redirectToSignIn();
  }

  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  return user;
}

export async function requireRole(
  allowedRoles: readonly AppRole[],
): Promise<AuthenticatedUser> {
  const user = await requireAuthentication();

  if (!allowedRoles.includes(user.role)) {
    notFound();
  }

  return user;
}

export async function requirePermission(
  permission: Permission,
): Promise<AuthenticatedUser> {
  const user = await requireAuthentication();

  if (!hasPermission(user.role, permission)) {
    notFound();
  }

  return user;
}

export function assertOwner(ownerId: string, currentUserId: string): void {
  if (ownerId !== currentUserId) {
    notFound();
  }
}
