import Link from "next/link";
import { formatTime } from "./format";

type Appointment = {
  id: string;
  patientName: string;
  patientInitials: string;
  reasonForVisit: string;
  appointmentDate: Date;
  appointmentStartTime: Date;
  appointmentEndTime: Date;
  appointmentStatus: string;
  appointmentType: string;
  hospitalName: string | null;
  hospitalLocation: string | null;
  hasConsultation: boolean;
};

type TodaysAppointmentsProps = {
  appointments: Appointment[];
};

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    CONFIRMED: "bg-[#d1fae5] text-[#065f46]",
    PENDING: "bg-[#fef9c3] text-[#854d0e]",
    COMPLETED: "bg-[#dbeafe] text-[#1e40af]",
    CANCELLED: "bg-[#fee2e2] text-[#991b1b]",
    NO_SHOW: "bg-[#fee2e2] text-[#991b1b]",
  };
  const cls = map[status] ?? "bg-[#f0f0f0] text-[#6b6b6b]";
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

/**
 * TodaysAppointments
 * Renders today's appointment list. Desktop uses a table layout, mobile uses cards.
 * Doubles as the live patient queue (ordered by start time).
 */
export function TodaysAppointments({ appointments }: TodaysAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="rounded-2xl border border-[#eeece8] bg-white overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.4fr_1.6fr_1fr_1fr_1.2fr] bg-[#d8dcff] px-6 py-3.5 text-sm font-semibold text-[#3d3d3d]">
          <span>Patient</span>
          <span>Reason</span>
          <span>Time</span>
          <span>Type</span>
          <span className="text-right">Action</span>
        </div>
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
          <h3 className="text-lg font-bold text-[#1a1a1a]">
            No appointments scheduled for today
          </h3>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            Enjoy the breather, or review your upcoming schedule.
          </p>
          <Link
            href="/doctor/appointments"
            id="doctor-empty-view-appointments"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#2641FF] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a30e8] active:scale-95"
          >
            View Appointments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#eeece8] bg-white overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[1.4fr_1.6fr_1fr_1fr_1.2fr] bg-[#d8dcff] px-6 py-3.5 text-sm font-semibold text-[#3d3d3d]">
          <span>Patient</span>
          <span>Reason</span>
          <span>Time</span>
          <span>Type</span>
          <span className="text-right">Action</span>
        </div>
        {appointments.map((apt, index) => (
          <div
            key={apt.id}
            className="grid grid-cols-[1.4fr_1.6fr_1fr_1fr_1.2fr] items-center px-6 py-4 border-t border-[#eeece8] hover:bg-[#faf9f7] transition-colors"
          >
            {/* Patient */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="h-9 w-9 rounded-full bg-[#eef0ff] text-[#2641FF] flex items-center justify-center font-bold text-xs">
                  {apt.patientInitials}
                </div>
                <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a] text-[9px] font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1a1a1a] truncate max-w-[160px]">
                  {apt.patientName}
                </p>
                <StatusPill status={apt.appointmentStatus} />
              </div>
            </div>
            {/* Reason */}
            <p className="text-sm text-[#3d3d3d] truncate max-w-[240px]">
              {apt.reasonForVisit}
            </p>
            {/* Time */}
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a]">
                {formatTime(apt.appointmentStartTime)}
              </p>
              <p className="text-xs text-[#9b9b9b]">
                to {formatTime(apt.appointmentEndTime)}
              </p>
            </div>
            {/* Type */}
            <span className="text-sm text-[#1a1a1a]">
              {apt.appointmentType === "VIRTUAL"
                ? "Video"
                : apt.hospitalName ?? "In-Person"}
            </span>
            {/* Action */}
            <div className="flex items-center justify-end gap-3">
              {apt.appointmentType === "VIRTUAL" && apt.hasConsultation ? (
                <Link
                  href={`/doctor/consultations/${apt.id}`}
                  id={`doctor-start-consult-${apt.id}`}
                  className="rounded-full bg-[#2641FF] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1a30e8]"
                >
                  Start
                </Link>
              ) : (
                <Link
                  href={`/doctor/appointments?appt=${apt.id}`}
                  id={`doctor-view-apt-${apt.id}`}
                  className="text-xs font-semibold text-[#2641FF] hover:underline"
                >
                  Details
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-[#eeece8]">
        {appointments.map((apt, index) => (
          <div key={apt.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-[#eef0ff] text-[#2641FF] flex items-center justify-center font-bold text-[10px]">
                    {apt.patientInitials}
                  </div>
                  <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a1a1a] text-[8px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {apt.patientName}
                  </p>
                  <p className="text-xs text-[#6b6b6b]">
                    {apt.appointmentType === "VIRTUAL"
                      ? "Video Consultation"
                      : apt.hospitalName ?? "In-Person"}
                  </p>
                </div>
              </div>
              <StatusPill status={apt.appointmentStatus} />
            </div>
            <p className="text-xs text-[#3d3d3d] line-clamp-2">
              {apt.reasonForVisit}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-[#2641FF]">
                🕐 {formatTime(apt.appointmentStartTime)}
              </span>
              {apt.appointmentType === "VIRTUAL" && apt.hasConsultation ? (
                <Link
                  href={`/doctor/consultations/${apt.id}`}
                  className="rounded-full bg-[#2641FF] px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Start
                </Link>
              ) : (
                <Link
                  href={`/doctor/appointments?appt=${apt.id}`}
                  className="text-xs font-semibold text-[#2641FF] hover:underline"
                >
                  Details
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
