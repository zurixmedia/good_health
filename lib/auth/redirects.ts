import { UserRole } from "@/app/generated/prisma/enums";

/**
 * Single source of truth for the post-authentication landing route of each
 * application role. Paths come directly from `ARCHITECTURE_CONTEXT.md`
 * (Patient/Doctor/Admin Application routes) and must not be invented here.
 *
 * Shared by both the client (post sign-in / sign-up redirect) and the server
 * (route guards, API responses) so the redirect target can never drift.
 */
export const DASHBOARD_PATHS: Record<UserRole, string> = {
  [UserRole.PATIENT]: "/patient/dashboard",
  [UserRole.DOCTOR]: "/doctor/dashboard",
  [UserRole.ADMIN]: "/admin/dashboard",
};

/**
 * Fallback used when a role cannot be resolved (e.g. a brand-new session whose
 * metadata has not synced yet). Sending the user back to the marketing home is
 * the safest recoverable action — it never exposes a protected dashboard.
 */
export const DEFAULT_REDIRECT_PATH = "/";

/**
 * Returns the dashboard path for the given role, or the marketing home page
 * when the role is unknown. The input is intentionally permissive (`unknown`)
 * so callers can pass raw Clerk metadata without an intermediate cast.
 */
export function getDashboardPath(role: unknown): string {
  if (
    typeof role === "string" &&
    Object.prototype.hasOwnProperty.call(DASHBOARD_PATHS, role)
  ) {
    return DASHBOARD_PATHS[role as UserRole];
  }
  return DEFAULT_REDIRECT_PATH;
}

/**
 * Client-side helper used right after a session becomes active (sign-in or
 * sign-up verification).
 *
 * The optional `roleHint` is client-supplied and therefore untrusted; it only
 * serves as a fallback when the server lookup fails. The authoritative role is
 * always read from `/api/auth/me`, which derives identity from the Clerk
 * session server-side and resolves against the database — so a tampered hint
 * can never grant dashboard access (the role layouts' `requireRole` guard is
 * the final backstop).
 */
export async function resolvePostAuthRedirectPath(
  roleHint?: string | null,
): Promise<string> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (res.ok) {
      const json = (await res.json()) as {
        success?: boolean;
        data?: { role?: string };
      };
      if (json.success && json.data?.role) {
        return getDashboardPath(json.data.role);
      }
    }
  } catch {
    // Non-fatal: fall through to the hint / default below.
  }
  return getDashboardPath(roleHint);
}
