"use client";

import React from "react";
import { formatDate, cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
  Badge,
  Flex,
  Stack,
} from "@/components/shared";
import { Button } from "@/components/ui/button";

interface MembershipPlanCardProps {
  plan: {
    id: string;
    name: string;
    description?: string;
    monthlyPrice: number;
    yearlyPrice?: number;
    consultationLimit?: number;
    supportsVirtualConsultation: boolean;
    isActive: boolean;
  };
  isActive?: boolean;
  isCurrentPlan?: boolean;
  billingPeriod?: "monthly" | "yearly";
  onSelect?: (planId: string, period: "monthly" | "yearly") => void;
  className?: string;
}

/**
 * MembershipPlanCard
 * Displays a single membership plan with pricing and features
 */
export function MembershipPlanCard({
  plan,
  isActive = true,
  isCurrentPlan = false,
  billingPeriod = "monthly",
  onSelect,
  className,
}: MembershipPlanCardProps) {
  const price =
    billingPeriod === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
  const savings =
    plan.yearlyPrice && billingPeriod === "yearly"
      ? (
          ((plan.monthlyPrice * 12 - plan.yearlyPrice) /
            (plan.monthlyPrice * 12)) *
          100
        ).toFixed(0)
      : null;

  return (
    <Card
      hoverable={!isCurrentPlan}
      className={cn(
        "relative",
        isCurrentPlan && "ring-2 ring-blue-500",
        className,
      )}
    >
      {isCurrentPlan && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-xs font-semibold">
          Current Plan
        </div>
      )}

      {savings && (
        <div className="absolute top-3 left-3">
          <Badge variant="success" size="sm">
            Save {savings}%
          </Badge>
        </div>
      )}

      <CardHeader>
        <Stack spacing="sm">
          <CardTitle>{plan.name}</CardTitle>
          {plan.description && (
            <CardDescription>{plan.description}</CardDescription>
          )}
        </Stack>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              ${typeof price === "number" ? price.toFixed(2) : "0.00"}
            </span>
            <span className="text-gray-600">
              /{billingPeriod === "yearly" ? "year" : "month"}
            </span>
          </div>
          {billingPeriod === "yearly" && plan.monthlyPrice && (
            <p className="text-xs text-gray-600">
              ${(plan.monthlyPrice * 12).toFixed(2)} per year
            </p>
          )}
        </div>

        {/* Features */}
        <Stack spacing="sm">
          {plan.consultationLimit && (
            <FeatureItem
              icon="✓"
              text={`Up to ${plan.consultationLimit} consultations per month`}
            />
          )}
          {plan.supportsVirtualConsultation && (
            <FeatureItem icon="✓" text="Video consultations included" />
          )}
          <FeatureItem icon="✓" text="Doctor directory access" />
          <FeatureItem icon="✓" text="24/7 member support" />
          <FeatureItem icon="✓" text="Health records management" />
        </Stack>

        {/* Action Button */}
        {!isCurrentPlan && isActive && (
          <Button
            onClick={() => onSelect?.(plan.id, billingPeriod)}
            className="w-full"
            variant={isCurrentPlan ? "outline" : "default"}
          >
            {isCurrentPlan ? "Current Plan" : "Select Plan"}
          </Button>
        )}
      </CardBody>
    </Card>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <Flex gap="sm" align="center">
      <span className="text-green-500 font-bold">{icon}</span>
      <span className="text-sm text-gray-700">{text}</span>
    </Flex>
  );
}

interface MembershipPlanGridProps {
  plans: MembershipPlanCardProps["plan"][];
  currentPlanId?: string;
  billingPeriod?: "monthly" | "yearly";
  onSelectPlan?: (planId: string, period: "monthly" | "yearly") => void;
  className?: string;
}

/**
 * MembershipPlanGrid
 * Displays multiple membership plans in a responsive grid
 */
export function MembershipPlanGrid({
  plans,
  currentPlanId,
  billingPeriod = "monthly",
  onSelectPlan,
  className,
}: MembershipPlanGridProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-3", className)}>
      {plans.map((plan) => (
        <MembershipPlanCard
          key={plan.id}
          plan={plan}
          isCurrentPlan={currentPlanId === plan.id}
          billingPeriod={billingPeriod}
          onSelect={onSelectPlan}
        />
      ))}
    </div>
  );
}

interface MembershipStatusProps {
  subscription: {
    id: string;
    status: string;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    membershipPlan: {
      name: string;
      monthlyPrice: number;
    };
  };
  className?: string;
}

/**
 * MembershipStatus
 * Displays current membership status
 */
export function MembershipStatus({
  subscription,
  className,
}: MembershipStatusProps) {
  const now = new Date();
  const daysRemaining = Math.ceil(
    (subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const percentRemaining =
    (daysRemaining /
      ((subscription.endDate.getTime() - subscription.startDate.getTime()) /
        (1000 * 60 * 60 * 24))) *
    100;

  const statusColor = {
    ACTIVE: "success",
    EXPIRED: "error",
    CANCELLED: "error",
    SUSPENDED: "warning",
  } as const;

  return (
    <Card className={className}>
      <CardHeader>
        <Flex justify="between" align="center">
          <CardTitle>Current Membership</CardTitle>
          <Badge
            variant={
              statusColor[subscription.status as keyof typeof statusColor]
            }
          >
            {subscription.status}
          </Badge>
        </Flex>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Plan</p>
            <p className="text-sm font-medium text-gray-900">
              {subscription.membershipPlan.name}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Price</p>
            <p className="text-sm font-medium text-gray-900">
              ${subscription.membershipPlan.monthlyPrice.toFixed(2)}/month
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Start Date
            </p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(subscription.startDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">End Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(subscription.endDate)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {subscription.status === "ACTIVE" && (
          <div className="space-y-2">
            <Flex justify="between">
              <span className="text-xs text-gray-600">Time Remaining</span>
              <span className="text-xs font-semibold text-gray-900">
                {daysRemaining} days
              </span>
            </Flex>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  percentRemaining > 30 ? "bg-green-500" : "bg-amber-500",
                )}
                style={{
                  width: `${Math.max(0, Math.min(100, percentRemaining))}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Auto Renew Status */}
        <div className="pt-2 border-t border-gray-200">
          <Flex justify="between" align="center">
            <span className="text-xs text-gray-600">Auto Renewal</span>
            <Badge
              variant={subscription.autoRenew ? "success" : "warning"}
              size="sm"
            >
              {subscription.autoRenew ? "Enabled" : "Disabled"}
            </Badge>
          </Flex>
        </div>
      </CardBody>
    </Card>
  );
}
