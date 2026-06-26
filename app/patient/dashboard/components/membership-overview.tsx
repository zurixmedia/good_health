import Link from "next/link";

type MembershipOverviewProps = {
  membership: {
    planName: string;
    status: string;
    endDate: Date;
  } | null;
};

function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * MembershipOverview Component
 * Displays the current active membership or a CTA to browse plans.
 */
export function MembershipOverview({ membership }: MembershipOverviewProps) {
  const isActive = membership?.status === "ACTIVE";

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white p-6 flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#6b6b6b] uppercase tracking-wider">
            Membership Status
          </h3>
          {membership && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isActive
                  ? "bg-[#d1fae5] text-[#065f46]"
                  : "bg-[#fef9c3] text-[#854d0e]"
              }`}
            >
              {membership.status}
            </span>
          )}
        </div>

        {membership ? (
          <div className="mt-4 space-y-2">
            <h4 className="text-2xl font-extrabold text-[#1a1a1a]">
              {membership.planName}
            </h4>
            <p className="text-sm text-[#6b6b6b]">
              Your subscription is active and gives you access to physical and virtual consultations.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-[#1a1a1a]">
              <span className="font-semibold text-[#6b6b6b]">Renews on:</span>
              <span className="font-bold text-[#1a1a1a]">
                {formatShortDate(membership.endDate)}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <h4 className="text-xl font-bold text-[#c0114e]">
              No Active Membership
            </h4>
            <p className="text-sm text-[#6b6b6b]">
              Please subscribe to a membership plan to schedule appointments with our verified doctor network.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#f0eee9] flex items-center justify-between">
        {membership ? (
          <>
            <span className="text-xs text-[#6b6b6b]">Manage your renewal settings</span>
            <Link
              href="/patient/membership/manage"
              id="dashboard-manage-membership-link"
              className="inline-flex items-center justify-center rounded-full border border-[#2641FF] px-5 py-2 text-sm font-semibold text-[#2641FF] transition hover:bg-[#eef0ff] active:scale-95"
            >
              Manage
            </Link>
          </>
        ) : (
          <>
            <span className="text-xs text-[#6b6b6b]">View flexible pricing plans</span>
            <Link
              href="/patient/membership"
              id="dashboard-browse-membership-link"
              className="inline-flex items-center justify-center rounded-full bg-[#2641FF] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a30e8] active:scale-95"
            >
              Choose Plan
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
