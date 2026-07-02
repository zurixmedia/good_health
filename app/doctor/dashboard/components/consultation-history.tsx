import Link from "next/link";
import { formatShortDate, formatTime } from "./format";

type HistoryItem = {
  id: string;
  appointmentId: string;
  patientName: string;
  appointmentDate: Date;
  appointmentStartTime: Date;
  appointmentStatus: string;
  appointmentType: string;
  consultationStatus: string | null;
  diagnosis: string | null;
  recommendations: string | null;
};

type ConsultationHistoryProps = {
  items: HistoryItem[];
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: "bg-[#d1fae5] text-[#065f46]",
    CANCELLED: "bg-[#fee2e2] text-[#991b1b]",
    NO_SHOW: "bg-[#fef9c3] text-[#854d0e]",
  };
  const cls = map[status] ?? "bg-[#f0f0f0] text-[#6b6b6b]";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

/**
 * ConsultationHistory
 * Recent completed/cancelled consultations with diagnosis summary.
 */
export function ConsultationHistory({ items }: ConsultationHistoryProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#eeece8] bg-white p-6 text-center">
        <p className="text-sm text-[#9b9b9b]">
          No consultation history yet. Completed appointments will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white overflow-hidden">
      <ul className="divide-y divide-[#eeece8]" role="list">
        {items.map((item) => (
          <li key={item.id} className="px-5 py-4 hover:bg-[#faf9f7] transition-colors">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {item.patientName}
                  </p>
                  <StatusBadge status={item.appointmentStatus} />
                </div>
                <p className="mt-0.5 text-xs text-[#9b9b9b]">
                  {formatShortDate(item.appointmentDate)} ·{" "}
                  {formatTime(item.appointmentStartTime)} ·{" "}
                  {item.appointmentType === "VIRTUAL" ? "Video" : "In-Person"}
                </p>
                {item.diagnosis && (
                  <p className="mt-2 text-sm text-[#3d3d3d]">
                    <span className="font-semibold text-[#1a1a1a]">Diagnosis: </span>
                    {item.diagnosis}
                  </p>
                )}
                {item.recommendations && (
                  <p className="mt-1 text-sm text-[#3d3d3d]">
                    <span className="font-semibold text-[#1a1a1a]">Plan: </span>
                    {item.recommendations}
                  </p>
                )}
              </div>
              <Link
                href={`/doctor/consultations/${item.appointmentId}`}
                id={`doctor-history-view-${item.id}`}
                className="text-xs font-semibold text-[#2641FF] hover:underline whitespace-nowrap"
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
