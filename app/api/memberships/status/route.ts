import { NextResponse } from "next/server";
import {
  getPatientActiveMembership,
  hasActiveMembership,
} from "@/actions/memberships";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/memberships/status
 * Get current user's membership status
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasActive = await hasActiveMembership(userId);
    const activeMembership = hasActive
      ? await getPatientActiveMembership(userId)
      : null;

    return NextResponse.json({
      hasActive,
      membership: activeMembership,
    });
  } catch (error) {
    console.error("[GET /api/memberships/status]", error);
    return NextResponse.json(
      { error: "Failed to fetch membership status" },
      { status: 500 },
    );
  }
}
