import Link from "next/link";
import { formatTime } from "./format";

type QueueItem = {
  id: string;
  patientName: string;
  patientInitials: string;
  appointmentStartTime: Date;
  appointmentStatus: string;
  appointmentType: string;
};

type PatientQueueProps = {
  items: QueueItem[];
};

/**
 * PatientQueue
 * Compact, ordered list of today's patients for the dashboard side column.
 * Mirrors the "Patient queue" concept from the feature spec.
 */
export function PatientQueue({ items }: PatientQueueProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#eeece8] bg-white p-6 text-center">
        <p className="text-sm text-[#9b9b9b]">Your queue is clear today.</p>
      </div>
    );
  }

  return (
    <ol className="rounded-2xl border border-[#eeece8] bg-white divide-y divide-[#eeece8]" role="list">
      {items.map((item, index) => {
        const isCheckedIn = item.appointmentStatus === "CONFIRMED";
        return (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] text-xs font-bold text-white">
              {index + 1}
            </span>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[#2641FF] text-xs font-bold">
              {item.patientInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                {item.patientName}
              </p>
              <p className="text-xs text-[#9b9b9b]">
                {formatTime(item.appointmentStartTime)} ·{" "}
                {item.appointmentType === "VIRTUAL" ? "Video" : "In-Person"}
              </p>
            </div>
            <span
              className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                isCheckedIn ? "bg-[#22c55e]" : "bg-[#f59e0b]"
              }`}
              title={item.appointmentStatus}
            />
          </li>
        );
      })}
      <li className="px-4 py-3 bg-[#faf9f7]">
        <Link
          href="/doctor/appointments"
          id="doctor-queue-view-all"
          className="text-sm font-semibold text-[#2641FF] hover:underline"
        >
          View all appointments →
        </Link>
      </li>
    </ol>
  );
}
