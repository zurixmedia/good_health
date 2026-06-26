import { UserRole } from "@/app/generated/prisma/enums";
import type { AppRole, Permission } from "@/types/auth";

export const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  [UserRole.PATIENT]: [
    "profile:view:own",
    "profile:update:own",
    "profile:upload-photo:own",
    "membership:plans:view",
    "membership:subscribe:own",
    "membership:renew:own",
    "membership:cancel:own",
    "doctors:search",
    "doctors:view",
    "appointments:create:own",
    "appointments:view:own",
    "appointments:cancel:own",
    "appointments:reschedule:own",
    "consultations:join:assigned",
    "consultations:view:own",
    "reviews:create:own",
    "reviews:update:own",
    "reviews:delete:own",
    "notifications:view:own",
    "notifications:update:own",
  ],
  [UserRole.DOCTOR]: [
    "profile:view:own",
    "profile:update:own",
    "doctors:profile:update:own",
    "doctors:credentials:upload:own",
    "availability:manage:own",
    "appointments:view:assigned",
    "appointments:cancel:assigned",
    "appointments:status:update:assigned",
    "consultations:join:assigned",
    "consultations:view:assigned",
    "consultations:notes:create:assigned",
    "consultations:complete:assigned",
    "reviews:view:doctor",
    "notifications:view:own",
    "notifications:update:own",
  ],
  [UserRole.ADMIN]: [
    "membership:plans:view",
    "membership:subscriptions:view:all",
    "membership:plans:manage",
    "doctors:search",
    "doctors:view",
    "doctors:verify",
    "doctors:reject",
    "doctors:suspend",
    "appointments:view:all",
    "appointments:cancel:all",
    "consultations:metadata:view:all",
    "notifications:view:own",
    "notifications:update:own",
    "users:view:all",
    "users:suspend",
    "users:reactivate",
    "hospitals:manage",
    "specializations:manage",
    "analytics:view",
  ],
} as const;

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(
  role: AppRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasEveryPermission(
  role: AppRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}
