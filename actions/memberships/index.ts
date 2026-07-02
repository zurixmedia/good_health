"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";

type DecimalLike = {
  toNumber(): number;
};

type MembershipPlanDTO = {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  consultationLimit?: number;
  supportsVirtualConsultation: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type MembershipSubscriptionDTO = {
  id: string;
  patientId: string;
  membershipPlanId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
  membershipPlan: {
    name: string;
    monthlyPrice: number;
  };
};

type MembershipSubscriptionWithPlan = {
  id: string;
  patientId: string;
  membershipPlanId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
  membershipPlan: {
    name: string;
    monthlyPrice: number | DecimalLike;
  };
};

function toNumberValue(value: number | DecimalLike | null | undefined) {
  if (value == null) {
    return null;
  }

  return typeof value === "number" ? value : value.toNumber();
}

function serializeMembershipPlan(plan: Awaited<
  ReturnType<typeof db.membershipPlan.findMany>
>[number]): MembershipPlanDTO {
  return {
    ...plan,
    description: plan.description ?? undefined,
    monthlyPrice: toNumberValue(plan.monthlyPrice) ?? 0,
    yearlyPrice: toNumberValue(plan.yearlyPrice) ?? undefined,
    consultationLimit: plan.consultationLimit ?? undefined,
  };
}

function serializeMembershipSubscription(
  subscription: MembershipSubscriptionWithPlan,
): MembershipSubscriptionDTO {
  return {
    ...subscription,
    membershipPlan: {
      ...subscription.membershipPlan,
      monthlyPrice: toNumberValue(subscription.membershipPlan.monthlyPrice) ?? 0,
    },
  };
}

/**
 * Resolves the PatientProfile row (id) for the currently-authenticated patient.
 *
 * This is the crux of the ID-mismatch fix: `MembershipSubscription.patientId`
 * is a foreign key to `PatientProfile.id`, NOT to the Clerk user id. The
 * previous code passed the Clerk id (`user.id` from `useUser()` / `auth()`)
 * which silently returned empty results on read and would violate the FK
 * constraint on create. Deriving it server-side also closes the IDOR hole
 * where a client could pass any patient id.
 */
async function requirePatientProfile(): Promise<{ id: string }> {
  const authUser = await requireRole([UserRole.PATIENT]);

  const profile = await db.patientProfile.findUnique({
    where: { userId: authUser.id },
    select: { id: true },
  });

  if (!profile) {
    throw new Error("Patient profile not found");
  }

  return profile;
}

/**
 * Get all active membership plans
 */
export async function getMembershipPlans() {
  try {
    const plans = await db.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: "asc" },
    });
    return plans.map(serializeMembershipPlan);
  } catch (error) {
    console.error("[getMembershipPlans]", error);
    throw new Error("Failed to fetch membership plans");
  }
}

/**
 * Get a specific membership plan by ID
 */
export async function getMembershipPlanById(planId: string) {
  try {
    const plan = await db.membershipPlan.findUnique({
      where: { id: planId },
    });
    return plan ? serializeMembershipPlan(plan) : null;
  } catch (error) {
    console.error("[getMembershipPlanById]", error);
    throw new Error("Failed to fetch membership plan");
  }
}

/**
 * Get the current patient's active membership.
 */
export async function getPatientActiveMembership() {
  try {
    const patient = await requirePatientProfile();
    const now = new Date();
    const subscription = await db.membershipSubscription.findFirst({
      where: {
        patientId: patient.id,
        status: "ACTIVE",
        endDate: { gte: now },
      },
      include: {
        membershipPlan: true,
      },
      orderBy: {
        endDate: "desc",
      },
    });
    return subscription
      ? serializeMembershipSubscription(subscription as MembershipSubscriptionWithPlan)
      : null;
  } catch (error) {
    console.error("[getPatientActiveMembership]", error);
    throw new Error("Failed to fetch active membership");
  }
}

/**
 * Get the current patient's full membership history (active, expired, cancelled).
 */
export async function getPatientMemberships() {
  try {
    const patient = await requirePatientProfile();
    const subscriptions = await db.membershipSubscription.findMany({
      where: { patientId: patient.id },
      include: {
        membershipPlan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return subscriptions.map((subscription) =>
      serializeMembershipSubscription(
        subscription as MembershipSubscriptionWithPlan,
      ),
    );
  } catch (error) {
    console.error("[getPatientMemberships]", error);
    throw new Error("Failed to fetch patient memberships");
  }
}

/**
 * Whether the current patient has an active membership.
 */
export async function hasActiveMembership(): Promise<boolean> {
  try {
    const subscription = await getPatientActiveMembership();
    return !!subscription;
  } catch {
    return false;
  }
}

/**
 * Create a new membership subscription for the current patient.
 */
export async function createMembershipSubscription(
  planId: string,
  billingPeriod: "monthly" | "yearly" = "monthly",
) {
  try {
    const patient = await requirePatientProfile();

    const plan = await getMembershipPlanById(planId);
    if (!plan) {
      throw new Error("Membership plan not found");
    }

    const startDate = new Date();
    const endDate = new Date();

    if (billingPeriod === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await db.membershipSubscription.create({
      data: {
        patientId: patient.id,
        membershipPlanId: planId,
        startDate,
        endDate,
        status: "ACTIVE",
        autoRenew: true,
      },
      include: {
        membershipPlan: true,
      },
    });

    revalidatePath("/patient/membership");
    revalidatePath("/patient/dashboard");

    return serializeMembershipSubscription(
      subscription as MembershipSubscriptionWithPlan,
    );
  } catch (error) {
    console.error("[createMembershipSubscription]", error);
    throw new Error("Failed to create membership subscription");
  }
}

/**
 * Guard helper: confirms a subscription belongs to the current patient before
 * any mutation. Throws if ownership check fails (which renders a 404 via the
 * guard's `notFound()`).
 */
async function requireOwnedSubscription(subscriptionId: string) {
  const patient = await requirePatientProfile();

  const subscription = await db.membershipSubscription.findUnique({
    where: { id: subscriptionId },
    select: { patientId: true },
  });

  if (!subscription || subscription.patientId !== patient.id) {
    throw new Error("Subscription not found");
  }

  return subscriptionId;
}

/**
 * Cancel the current patient's membership subscription.
 */
export async function cancelMembershipSubscription(subscriptionId: string) {
  try {
    await requireOwnedSubscription(subscriptionId);

    const subscription = await db.membershipSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: "CANCELLED",
        autoRenew: false,
      },
      include: {
        membershipPlan: true,
      },
    });

    revalidatePath("/patient/membership");
    revalidatePath("/patient/dashboard");

    return serializeMembershipSubscription(
      subscription as MembershipSubscriptionWithPlan,
    );
  } catch (error) {
    console.error("[cancelMembershipSubscription]", error);
    throw new Error("Failed to cancel membership subscription");
  }
}

/**
 * Renew the current patient's membership subscription.
 */
export async function renewMembershipSubscription(subscriptionId: string) {
  try {
    await requireOwnedSubscription(subscriptionId);

    const subscription = await db.membershipSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const newEndDate = new Date(subscription.endDate);
    const diffMonths = Math.round(
      (subscription.endDate.getTime() - subscription.startDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    );

    if (diffMonths >= 11) {
      // Yearly plan
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    } else {
      // Monthly plan
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    }

    const updated = await db.membershipSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: "ACTIVE",
        endDate: newEndDate,
      },
      include: {
        membershipPlan: true,
      },
    });

    revalidatePath("/patient/membership");
    revalidatePath("/patient/dashboard");

    return serializeMembershipSubscription(updated as MembershipSubscriptionWithPlan);
  } catch (error) {
    console.error("[renewMembershipSubscription]", error);
    throw new Error("Failed to renew membership subscription");
  }
}

/**
 * Update the auto-renew setting on the current patient's subscription.
 */
export async function updateAutoRenew(
  subscriptionId: string,
  autoRenew: boolean,
) {
  try {
    await requireOwnedSubscription(subscriptionId);

    const subscription = await db.membershipSubscription.update({
      where: { id: subscriptionId },
      data: { autoRenew },
      include: {
        membershipPlan: true,
      },
    });

    revalidatePath("/patient/membership");

    return serializeMembershipSubscription(
      subscription as MembershipSubscriptionWithPlan,
    );
  } catch (error) {
    console.error("[updateAutoRenew]", error);
    throw new Error("Failed to update auto-renew setting");
  }
}

/**
 * Get membership statistics (admin).
 */
export async function getMembershipStats() {
  try {
    const totalPlans = await db.membershipPlan.count();
    const activePlans = await db.membershipPlan.count({
      where: { isActive: true },
    });
    const activeSubscriptions = await db.membershipSubscription.count({
      where: { status: "ACTIVE" },
    });
    const expiredSubscriptions = await db.membershipSubscription.count({
      where: { status: "EXPIRED" },
    });

    return {
      totalPlans,
      activePlans,
      activeSubscriptions,
      expiredSubscriptions,
    };
  } catch (error) {
    console.error("[getMembershipStats]", error);
    throw new Error("Failed to fetch membership statistics");
  }
}
