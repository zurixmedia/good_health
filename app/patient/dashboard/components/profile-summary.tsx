import Link from "next/link";

type ProfileSummaryProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
    profileCompleted: boolean;
    profileCompletionPercentage: number;
  };
};

/**
 * ProfileSummary Component
 * Renders user details, profile completion percentage, and an edit profile CTA.
 */
export function ProfileSummary({ user }: ProfileSummaryProps) {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white p-6 flex flex-col justify-between h-full min-h-[220px]">
      <div>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-14 w-14 rounded-full object-cover border border-[#eeece8]"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef0ff] text-base font-extrabold text-[#2641FF]">
              {initials}
            </div>
          )}

          {/* User Info */}
          <div>
            <h3 className="text-lg font-bold text-[#1a1a1a]">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-[#6b6b6b] truncate max-w-[200px]">
              {user.email}
            </p>
          </div>
        </div>

        {/* Completeness Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-semibold mb-2">
            <span className="text-[#1a1a1a]">Profile Completeness</span>
            <span className="text-[#2641FF]">{user.profileCompletionPercentage}%</span>
          </div>
          {/* Progress bar wrapper */}
          <div className="h-2.5 w-full rounded-full bg-[#f0f0f0] overflow-hidden">
            <div
              className="h-full bg-[#2641FF] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${user.profileCompletionPercentage}%` }}
              role="progressbar"
              aria-valuenow={user.profileCompletionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="mt-2 text-xs text-[#6b6b6b]">
            {user.profileCompleted
              ? "Your profile is fully complete! Thank you! 🎉"
              : "Complete your profile to get faster appointment approvals."}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#f0eee9] flex justify-end">
        <Link
          href="/patient/profile"
          id="dashboard-edit-profile-link"
          className="text-sm font-semibold text-[#2641FF] hover:underline flex items-center gap-1 transition"
        >
          Edit Profile
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
