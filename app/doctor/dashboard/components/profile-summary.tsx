import Link from "next/link";
import { formatCurrency } from "./format";

type ProfileSummaryProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
  };
  doctor: {
    specializationName: string | null;
    verificationStatus: string;
    yearsOfExperience: number | null;
    consultationFee: number | null;
    supportsVirtualConsultation: boolean;
  };
};

function VerificationBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    VERIFIED: { label: "Verified", cls: "bg-[#d1fae5] text-[#065f46]" },
    PENDING: { label: "Pending Review", cls: "bg-[#fef9c3] text-[#854d0e]" },
    REJECTED: { label: "Rejected", cls: "bg-[#fee2e2] text-[#991b1b]" },
    SUSPENDED: { label: "Suspended", cls: "bg-[#fee2e2] text-[#991b1b]" },
  };
  const entry = map[status] ?? {
    label: status,
    cls: "bg-[#f0f0f0] text-[#6b6b6b]",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

/**
 * ProfileSummary
 * Compact doctor profile card for the dashboard: identity, specialization,
 * verification status, experience, fee, and an edit-profile CTA.
 */
export function ProfileSummary({ user, doctor }: ProfileSummaryProps) {
  const initials = `${user.firstName.charAt(0)}${user.lastName
    .charAt(0)}`.toUpperCase();

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
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
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-[#1a1a1a] truncate">
              Dr. {user.firstName} {user.lastName}
            </h3>
            <VerificationBadge status={doctor.verificationStatus} />
          </div>
          <p className="text-sm text-[#6b6b6b] truncate">
            {doctor.specializationName ?? "Specialization not set"}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-3 py-2">
          <dt className="text-xs text-[#9b9b9b]">Experience</dt>
          <dd className="font-semibold text-[#1a1a1a]">
            {doctor.yearsOfExperience != null
              ? `${doctor.yearsOfExperience} yrs`
              : "—"}
          </dd>
        </div>
        <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-3 py-2">
          <dt className="text-xs text-[#9b9b9b]">Consultation Fee</dt>
          <dd className="font-semibold text-[#1a1a1a]">
            {doctor.consultationFee != null
              ? formatCurrency(doctor.consultationFee)
              : "—"}
          </dd>
        </div>
        <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] px-3 py-2 col-span-2">
          <dt className="text-xs text-[#9b9b9b]">Virtual Consultations</dt>
          <dd className="font-semibold text-[#1a1a1a]">
            {doctor.supportsVirtualConsultation ? "Enabled" : "Disabled"}
          </dd>
        </div>
      </dl>

      <div className="mt-auto pt-2">
        <Link
          href="/doctor/profile"
          id="doctor-edit-profile-link"
          className="inline-flex w-full items-center justify-center rounded-full border border-[#2641FF] px-5 py-2.5 text-sm font-semibold text-[#2641FF] transition hover:bg-[#eef0ff] active:scale-95"
        >
          Manage Profile
        </Link>
      </div>
    </div>
  );
}
