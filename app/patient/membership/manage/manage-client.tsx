"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
import { cn, formatDate } from "@/lib/utils";
import {
  cancelMembershipSubscription,
  renewMembershipSubscription,
  updateAutoRenew,
} from "@/actions/memberships";

type ActiveMembership = {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  membershipPlan: {
    name: string;
    monthlyPrice: any;
  };
} | null;

type MembershipHistoryItem = {
  id: string;
  status: string;
  startDate: Date;
  endDate: Date;
  membershipPlan: {
    name: string;
  };
};

type Props = {
  activeMembership: ActiveMembership;
  allMemberships: MembershipHistoryItem[];
  user: PatientUser;
};

export function MembershipManageClient({ activeMembership, allMemberships, user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = (subscriptionId: string) => {
    if (!confirm("Are you sure you want to cancel your membership?")) return;
    startTransition(async () => {
      try {
        await cancelMembershipSubscription(subscriptionId);
        window.location.reload();
      } catch (error) {
        console.error("Failed to cancel membership:", error);
      }
    });
  };

  const handleRenew = (subscriptionId: string) => {
    startTransition(async () => {
      try {
        await renewMembershipSubscription(subscriptionId);
        window.location.reload();
      } catch (error) {
        console.error("Failed to renew membership:", error);
      }
    });
  };

  const handleAutoRenewToggle = (subscriptionId: string, currentValue: boolean) => {
    startTransition(async () => {
      try {
        await updateAutoRenew(subscriptionId, !currentValue);
        window.location.reload();
      } catch (error) {
        console.error("Failed to update auto-renew:", error);
      }
    });
  };

  return (
    <PatientShellClient user={user} title="Manage Membership">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Membership Management</h1>
          <p className="text-sm text-[#6b6b6b]">View and manage your active subscriptions and billing history.</p>
        </div>
        <button
          onClick={() => router.push("/patient/membership")}
          className="rounded-full bg-[#2641FF] px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#2641FF]/10 transition hover:bg-[#1a30e8]"
        >
          Browse Plans
        </button>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Active plan card */}
        {activeMembership ? (
          <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#eeece8] pb-4 gap-2">
              <div>
                <span className="text-xs font-bold text-[#9b9b9b] uppercase tracking-wide">Current Plan</span>
                <h3 className="text-xl font-bold text-[#1a1a1a] mt-0.5">{activeMembership.membershipPlan.name}</h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 self-start sm:self-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm text-[#1a1a1a]">
              <div>
                <p className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Start Date</p>
                <p className="font-semibold mt-1">{formatDate(activeMembership.startDate)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Next Billing Date</p>
                <p className="font-semibold mt-1">{formatDate(activeMembership.endDate)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Auto-Renew</p>
                <p className="font-semibold mt-1">{activeMembership.autoRenew ? "Enabled" : "Disabled"}</p>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="border-t border-[#eeece8] pt-6">
              <h4 className="text-sm font-bold text-[#1a1a1a] mb-4">Subscription Actions</h4>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => handleAutoRenewToggle(activeMembership.id, activeMembership.autoRenew)}
                  disabled={isPending}
                  className="rounded-xl border border-[#eeece8] bg-white py-2.5 text-xs font-semibold text-[#1a1a1a] hover:bg-[#f5f5f5] transition disabled:opacity-60"
                >
                  {activeMembership.autoRenew ? "Disable Auto-Renew" : "Enable Auto-Renew"}
                </button>
                <button
                  onClick={() => handleRenew(activeMembership.id)}
                  disabled={isPending}
                  className="rounded-xl border border-[#eeece8] bg-white py-2.5 text-xs font-semibold text-[#1a1a1a] hover:bg-[#f5f5f5] transition disabled:opacity-60"
                >
                  Renew Now
                </button>
                <button
                  onClick={() => router.push("/patient/membership")}
                  className="rounded-xl border border-[#eeece8] bg-white py-2.5 text-xs font-semibold text-[#1a1a1a] hover:bg-[#f5f5f5] transition"
                >
                  Change Plan
                </button>
                <button
                  onClick={() => handleCancel(activeMembership.id)}
                  disabled={isPending}
                  className="rounded-xl border border-red-100 bg-red-50 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-60"
                >
                  Cancel Membership
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eeece8] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f7]">
              <svg className="h-6 w-6 text-[#9b9b9b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <p className="text-base font-bold text-[#1a1a1a]">No Active Membership</p>
            <p className="text-xs text-[#6b6b6b] mt-1 mb-6">Choose a subscription plan to unlock secure consultation rooms.</p>
            <button
              onClick={() => router.push("/patient/membership")}
              className="rounded-full bg-[#2641FF] px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#2641FF]/10 transition hover:bg-[#1a30e8]"
            >
              View Plans
            </button>
          </div>
        )}

        {/* History Table */}
        {allMemberships.length > 0 && (
          <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1a1a1a]">Subscription History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#6b6b6b]">
                <thead className="border-b border-[#eeece8] text-xs font-bold text-[#9b9b9b] uppercase">
                  <tr>
                    <th className="pb-3 pr-4">Plan Name</th>
                    <th className="pb-3 pr-4">Start Date</th>
                    <th className="pb-3 pr-4">End Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeece8]">
                  {allMemberships.map((sub) => (
                    <tr key={sub.id} className="text-xs font-medium text-[#1a1a1a]">
                      <td className="py-3 pr-4 font-bold">{sub.membershipPlan.name}</td>
                      <td className="py-3 pr-4">{formatDate(sub.startDate)}</td>
                      <td className="py-3 pr-4">{formatDate(sub.endDate)}</td>
                      <td className="py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border",
                            sub.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-600 border-gray-200",
                          )}
                        >
                          {sub.status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PatientShellClient>
  );
}
