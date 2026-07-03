/**
 * Backwards-compatible re-export.
 *
 * The canonical patient shell now lives at `@/components/patient` and fetches
 * its own user identity server-side. The dashboard page passes the already-
 * fetched user data through the client component directly.
 */
export { PatientShellClient as DashboardShell } from "@/components/patient/patient-shell-client";
