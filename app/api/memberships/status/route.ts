import { NextResponse } from "next/server";
import {
  getPatientActiveMembership,
  hasActiveMembership,
} from "@/actions/memberships";

/**
 * GET /api/memberships/status
 * Get the current patient's membership status.
 *
 * Identity is resolved inside the actions (from the Clerk session →
 * PatientProfile.id), so no client-supplied id is trusted here.
 */
export async function GET() {
  try {
    const hasActive = await hasActiveMembership();
    const activeMembership = hasActive
      ? await getPatientActiveMembership()
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
