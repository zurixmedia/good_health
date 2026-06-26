import { NextResponse } from "next/server";
import { getMembershipPlans } from "@/actions/memberships";

/**
 * GET /api/memberships/plans
 * Get all active membership plans
 */
export async function GET() {
  try {
    const plans = await getMembershipPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("[GET /api/memberships/plans]", error);
    return NextResponse.json(
      { error: "Failed to fetch membership plans" },
      { status: 500 },
    );
  }
}
