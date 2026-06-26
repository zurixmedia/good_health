import type { UserRole } from "@/app/generated/prisma/enums";

export type AppRole = UserRole;

export type Permission =
  | "profile:view:own"
  | "profile:update:own"
  | "profile:upload-photo:own"
  | "membership:plans:view"
  | "membership:subscribe:own"
  | "membership:renew:own"
  | "membership:cancel:own"
  | "membership:subscriptions:view:all"
  | "membership:plans:manage"
  | "doctors:search"
  | "doctors:view"
  | "doctors:profile:update:own"
  | "doctors:credentials:upload:own"
  | "doctors:verify"
  | "doctors:reject"
  | "doctors:suspend"
  | "availability:manage:own"
  | "appointments:create:own"
  | "appointments:view:own"
  | "appointments:view:assigned"
  | "appointments:view:all"
  | "appointments:cancel:own"
  | "appointments:cancel:assigned"
  | "appointments:cancel:all"
  | "appointments:reschedule:own"
  | "appointments:status:update:assigned"
  | "consultations:join:assigned"
  | "consultations:view:own"
  | "consultations:view:assigned"
  | "consultations:notes:create:assigned"
  | "consultations:complete:assigned"
  | "consultations:metadata:view:all"
  | "reviews:create:own"
  | "reviews:update:own"
  | "reviews:delete:own"
  | "reviews:view:doctor"
  | "notifications:view:own"
  | "notifications:update:own"
  | "users:view:all"
  | "users:suspend"
  | "users:reactivate"
  | "hospitals:manage"
  | "specializations:manage"
  | "analytics:view";

export type AuthenticatedUser = {
  id: string;
  clerkId: string;
  email: string;
  role: AppRole;
  isActive: boolean;
};
