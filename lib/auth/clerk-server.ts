import "server-only";

import { createClerkClient } from "@clerk/nextjs/server";

import { UserRole } from "@/app/generated/prisma/enums";

/**
 * Server-side Clerk helpers.
 *
 * The Clerk Backend API exposes `users.updateUser` and `users.updateUserMetadata`.
 * Updating metadata via `updateUser` is deprecated by Clerk (its metadata params
 * carry a `@deprecated` marker); `updateUserMetadata` is the supported, deep-merge
 * API and is what we use here.
 *
 * `publicMetadata` is the secure store: readable from the Frontend API but writable
 * only from the Backend API, so it is the correct home for the user's role. The
 * client writes the sign-up role into `unsafeMetadata` (the only metadata it is
 * allowed to write); the webhook then promotes it here.
 */

let cachedClient: ReturnType<typeof createClerkClient> | null = null;

/**
 * Lazily builds a Clerk backend client. The secret key is required server-side;
 * if it is missing we throw early instead of silently failing role promotion.
 */
function clerkServerClient(): ReturnType<typeof createClerkClient> {
  if (cachedClient) {
    return cachedClient;
  }
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error(
      "CLERK_SECRET_KEY is not set. Server-side Clerk calls are unavailable.",
    );
  }
  cachedClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  return cachedClient;
}

/**
 * Promotes the user's application role into Clerk `publicMetadata`.
 *
 * Idempotent and safe to call on every `user.created` / `user.updated` event.
 * Failures are non-fatal for the webhook (the role is already persisted to the
 * database), so callers are expected to wrap this in a try/catch and log.
 */
export async function promoteRoleToPublicMetadata(
  clerkUserId: string,
  role: UserRole,
): Promise<void> {
  await clerkServerClient().users.updateUserMetadata(clerkUserId, {
    publicMetadata: { role },
  });
}
