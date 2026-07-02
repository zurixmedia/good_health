import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user. Identity is derived from the Clerk
 * session server-side — never from client-supplied input — and resolved against
 * the application database via `getCurrentUser`.
 *
 * Contract: `context/API_CONTRACTS.md` → "Get Current User".
 * Envelope: `{ success, data }` / `{ success, error }`.
 */
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}
