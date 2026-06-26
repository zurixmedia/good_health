import Link from "next/link";

type QuickActionsProps = {
  profileCompleted: boolean;
};

/**
 * QuickActions
 * Three action cards: Book Appointment, Complete Profile, Manage Subscription.
 * Matches the Figma desktop and mobile designs exactly.
 */
export function QuickActions({ profileCompleted }: QuickActionsProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Quick actions"
    >
      {/* Book New Appointment */}
      <div className="rounded-2xl border border-[#eeece8] bg-[#f5f5f5] p-6 flex flex-col gap-4">
        <div>
          {/* Icon (mobile) */}
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef0ff] lg:hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2641FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#1a1a1a]">
            New Appointment
          </h3>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            Ready to book your next hospital appointment?
          </p>
        </div>
        <div className="mt-auto">
          <Link
            href="/patient/appointments"
            id="quick-action-book-now"
            className="inline-flex items-center justify-center rounded-full bg-[#2641FF] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a30e8] active:scale-95"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Complete Profile */}
      <div className="rounded-2xl border border-[#eeece8] bg-[#f5f5f5] p-6 flex flex-col gap-4">
        <div>
          {/* Icon (mobile) */}
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fef9e7] lg:hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c09000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#1a1a1a]">
            Complete your profile
          </h3>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            Help us serve you better by completing your profile information.
          </p>
        </div>
        <div className="mt-auto">
          <Link
            href="/patient/profile"
            id="quick-action-complete-profile"
            className={`inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold transition hover:bg-[#f0f0f0] active:scale-95 ${
              profileCompleted
                ? "border-[#6b6b6b] text-[#6b6b6b]"
                : "border-[#2641FF] text-[#2641FF]"
            }`}
          >
            {profileCompleted ? "View profile" : "Complete profile"}
          </Link>
        </div>
      </div>

      {/* Manage Subscription */}
      <div className="rounded-2xl border border-[#eeece8] bg-[#f5f5f5] p-6 flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
        <div>
          {/* Icon (mobile) */}
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fce8ee] lg:hidden">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c0114e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#1a1a1a]">
            Manage your subscription
          </h3>
          <p className="mt-1 text-sm text-[#6b6b6b]">
            Handle your subscription options effortlessly.
          </p>
        </div>
        <div className="mt-auto">
          <Link
            href="/patient/membership"
            id="quick-action-manage-plans"
            className="inline-flex items-center justify-center rounded-full border border-[#2641FF] px-6 py-2.5 text-sm font-semibold text-[#2641FF] transition hover:bg-[#f0f0f0] active:scale-95"
          >
            Manage plans
          </Link>
        </div>
      </div>
    </div>
  );
}
