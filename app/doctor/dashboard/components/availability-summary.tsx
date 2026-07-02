import Link from "next/link";
import { dayName, formatTime } from "./format";

type AvailabilitySummaryProps = {
  availability: {
    id: string;
    dayOfWeek: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
  }[];
};

/**
 * AvailabilitySummary
 * Compact weekly schedule snapshot with a CTA to the full availability manager.
 */
export function AvailabilitySummary({ availability }: AvailabilitySummaryProps) {
  // Group rules by day of week for display
  const byDay = new Map<number, { start: Date; end: Date }[]>();
  for (const rule of availability) {
    const arr = byDay.get(rule.dayOfWeek) ?? [];
    arr.push({ start: rule.startTime, end: rule.endTime });
    byDay.set(rule.dayOfWeek, arr);
  }

  const days = [1, 2, 3, 4, 5, 6, 0]; // Monday → Sunday ordering

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#1a1a1a]">Weekly Availability</h3>
          <p className="text-xs text-[#6b6b6b]">
            Your recurring working schedule
          </p>
        </div>
        <Link
          href="/doctor/availability"
          id="doctor-manage-availability"
          className="text-sm font-semibold text-[#2641FF] hover:underline"
        >
          Manage
        </Link>
      </div>

      {availability.length === 0 ? (
        <div className="rounded-xl bg-[#faf9f7] border border-[#eeece8] p-6 text-center">
          <p className="text-sm text-[#6b6b6b]">
            No recurring availability set yet.
          </p>
          <Link
            href="/doctor/availability"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-[#2641FF] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1a30e8]"
          >
            Set Availability
          </Link>
        </div>
      ) : (
        <ul className="space-y-2" role="list">
          {days.map((d) => {
            const slots = byDay.get(d);
            if (!slots || slots.length === 0) {
              return (
                <li
                  key={d}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  <span className="font-medium text-[#1a1a1a] w-28">
                    {dayName(d)}
                  </span>
                  <span className="text-[#9b9b9b]">Unavailable</span>
                </li>
              );
            }
            return (
              <li
                key={d}
                className="flex items-center justify-between py-1.5 text-sm"
              >
                <span className="font-medium text-[#1a1a1a] w-28">
                  {dayName(d)}
                </span>
                <span className="text-[#2641FF] font-semibold text-right">
                  {slots
                    .map((s) => `${formatTime(s.start)} – ${formatTime(s.end)}`)
                    .join(", ")}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
