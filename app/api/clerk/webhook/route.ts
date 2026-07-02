import { verifyWebhook } from "@clerk/backend/webhooks";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { UserRole } from "@/app/generated/prisma/enums";
import { promoteRoleToPublicMetadata } from "@/lib/auth/clerk-server";

/**
 * Valid application roles. The sign-up form writes the selected role into Clerk
 * `unsafe_metadata.role` (the only metadata a client may write); this webhook
 * is what promotes it into the secure, backend-writable stores (database +
 * `public_metadata`). Anything outside this set falls back to PATIENT — the
 * least-privileged, most common role — which is the safest default for
 * healthcare access control.
 */
const VALID_ROLES = new Set<string>([UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN]);

/**
 * Parses a role from raw Clerk metadata. Returns `null` when no valid role is
 * present, which lets the caller distinguish "client did not send a role" from
 * "client sent an invalid role" (the latter still resolves to PATIENT).
 */
function parseRole(metadataRole: unknown): UserRole | null {
  if (typeof metadataRole === "string" && VALID_ROLES.has(metadataRole)) {
    return metadataRole as UserRole;
  }
  return null;
}

/**
 * Resolves the role a user should be persisted as.
 *
 * Precedence: an explicit, valid `unsafe_metadata.role` from sign-up wins.
 * Otherwise we keep the role already stored in `public_metadata` (set by an
 * earlier webhook or an admin), so a subsequent `user.updated` event for an
 * unrelated field cannot silently downgrade an account. Final fallback is
 * PATIENT for brand-new accounts with no role signal at all.
 */
function resolveRole(
  existingUser: { role: UserRole } | null,
  data: {
    unsafe_metadata?: { role?: unknown };
    public_metadata?: { role?: unknown };
  },
): UserRole {
  return (
    parseRole(data.unsafe_metadata?.role) ??
    existingUser?.role ??
    parseRole(data.public_metadata?.role) ??
    UserRole.PATIENT
  );
}

/**
 * Extracts the primary email address from a Clerk user webhook payload.
 * Clerk stores emails on `email_addresses[]`; the active one is flagged by
 * `primary_email_address_id`.
 */
function getPrimaryEmail(user: {
  email_addresses: { id: string; email_address: string }[];
  primary_email_address_id: string | null;
}): string {
  if (!user.email_addresses || user.email_addresses.length === 0) {
    return "";
  }

  if (user.primary_email_address_id) {
    const primary = user.email_addresses.find(
      (entry) => entry.id === user.primary_email_address_id,
    );
    if (primary) {
      return primary.email_address;
    }
  }

  return user.email_addresses[0]?.email_address ?? "";
}

export async function POST(request: Request) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("[clerk/webhook] verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.deleted") {
    const clerkUserId = event.data.id;
    if (!clerkUserId) {
      return NextResponse.json({ ok: true });
    }

    try {
      await prisma.user.deleteMany({ where: { clerkId: clerkUserId } });
    } catch (error) {
      console.error("[clerk/webhook] user.deleted failed", error);
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // Both user.created and user.updated share the same UserJSON payload.
  if (event.type !== "user.created" && event.type !== "user.updated") {
    // Not an event we manage; acknowledge so Clerk stops retrying.
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const data = event.data;

  // Clerk guarantees an immutable id. Everything else can be empty for users
  // who sign in via OAuth before completing their profile.
  if (!data.id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const email = getPrimaryEmail(data).toLowerCase();
  const firstName = data.first_name?.trim() || "Unknown";
  const lastName = data.last_name?.trim() || "";

  // Load the existing record so an unrelated `user.updated` event cannot
  // clobber a role that was previously set (by sign-up or by an admin).
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: data.id },
    select: { role: true },
  });
  const role = resolveRole(existingUser, data);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { clerkId: data.id },
        update: {
          email,
          firstName,
          lastName,
          role,
          profileImageUrl: data.image_url || null,
          phoneNumber:
            data.phone_numbers?.[0]?.phone_number ?? null,
        },
        create: {
          clerkId: data.id,
          email,
          firstName,
          lastName,
          role,
          profileImageUrl: data.image_url || null,
          phoneNumber:
            data.phone_numbers?.[0]?.phone_number ?? null,
        },
        select: { id: true, role: true },
      });

      // Keep the role-specific profile in sync with the user's role.
      if (role === UserRole.PATIENT) {
        await tx.patientProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        });
      } else if (role === UserRole.DOCTOR) {
        await tx.doctorProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        });
      }
    });

    // Promote the resolved role into Clerk `public_metadata`, the secure
    // backend-writable store that RBAC reads from. Best-effort: the role is
    // already persisted to the database above, so a Clerk API failure here
    // must not fail the webhook (which would trigger Clerk retries).
    try {
      await promoteRoleToPublicMetadata(data.id, role);
    } catch (promotionError) {
      console.error(
        `[clerk/webhook] role promotion failed for ${data.id}`,
        promotionError,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`[clerk/webhook] ${event.type} failed`, error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
