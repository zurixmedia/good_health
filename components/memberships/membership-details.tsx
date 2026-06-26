"use client";

import React from "react";
import {
  Card,
  CardBody,
  Stack,
  Flex,
  Muted,
} from "@/components/shared";
import { formatDate } from "@/lib/utils";

interface MembershipHistoryProps {
  subscriptions: {
    id: string;
    status: string;
    startDate: Date;
    endDate: Date;
    membershipPlan: {
      name: string;
      monthlyPrice: number;
    };
  }[];
  className?: string;
}

/**
 * MembershipHistory
 * Shows all past and current membership subscriptions
 */
export function MembershipHistory({
  subscriptions,
  className,
}: MembershipHistoryProps) {
  if (subscriptions.length === 0) {
    return (
      <Card className={className}>
        <CardBody>
          <Muted>No membership history available.</Muted>
        </CardBody>
      </Card>
    );
  }

  return (
    <Stack spacing="md" className={className}>
      {subscriptions.map((sub) => (
        <Card key={sub.id}>
          <CardBody>
            <Flex justify="between" align="start">
              <div>
                <p className="font-semibold text-gray-900">
                  {sub.membershipPlan.name}
                </p>
                <Muted>
                  {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                </Muted>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${sub.membershipPlan.monthlyPrice.toFixed(2)}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    sub.status === "ACTIVE"
                      ? "text-green-600"
                      : sub.status === "EXPIRED"
                        ? "text-gray-500"
                        : "text-red-600"
                  }`}
                >
                  {sub.status}
                </p>
              </div>
            </Flex>
          </CardBody>
        </Card>
      ))}
    </Stack>
  );
}

interface BillingPeriodToggleProps {
  period: "monthly" | "yearly";
  onChange: (period: "monthly" | "yearly") => void;
}

/**
 * BillingPeriodToggle
 * Toggle between monthly and yearly billing
 */
export function BillingPeriodToggle({
  period,
  onChange,
}: BillingPeriodToggleProps) {
  return (
    <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1 w-fit">
      <button
        onClick={() => onChange("monthly")}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          period === "monthly"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange("yearly")}
        className={`px-4 py-2 rounded font-medium transition-colors ${
          period === "yearly"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Yearly
        {period === "yearly" && (
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Save 15%
          </span>
        )}
      </button>
    </div>
  );
}
