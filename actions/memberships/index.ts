"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
 * Get patient's current active membership
 */
export async function getPatientActiveMembership(patientId: string) {
  try {
    const now = new Date();
    const subscription = await db.membershipSubscription.findFirst({
      where: {
        patientId,
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
 * Get all patient memberships (active, expired, cancelled)
 */
export async function getPatientMemberships(patientId: string) {
  try {
    const subscriptions = await db.membershipSubscription.findMany({
      where: { patientId },
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
 * Check if patient has active membership
 */
export async function hasActiveMembership(patientId: string): Promise<boolean> {
  try {
    const subscription = await getPatientActiveMembership(patientId);
    return !!subscription;
  } catch {
    return false;
  }
}

/**
 * Create a new membership subscription
 */
export async function createMembershipSubscription(
  patientId: string,
  planId: string,
  billingPeriod: "monthly" | "yearly" = "monthly",
) {
  try {
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
        patientId,
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
 * Cancel membership subscription
 */
export async function cancelMembershipSubscription(subscriptionId: string) {
  try {
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
 * Renew membership subscription
 */
export async function renewMembershipSubscription(subscriptionId: string) {
  try {
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
 * Update membership auto-renew setting
 */
export async function updateAutoRenew(
  subscriptionId: string,
  autoRenew: boolean,
) {
  try {
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
 * Get membership statistics
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
