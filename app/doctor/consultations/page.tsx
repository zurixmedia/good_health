import Link from "next/link";
import {
  Badge,
  Body,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  Grid,
  H1,
  H2,
  Text,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { getDoctorConsultations } from "./actions";
import type { DoctorConsultationSummary } from "./actions";

export const metadata = {
  title: "Consultations | GoodHealth Doctor",
  description:
    "Manage your video consultations, view patient rooms, and review clinical notes.",
};

function statusVariant(
  status: string,
): "success" | "primary" | "secondary" | "warning" | "default" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "SCHEDULED":
      return "primary";
    case "COMPLETED":
      return "secondary";
    case "MISSED":
      return "warning";
    default:
      return "default";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Live now";
    case "SCHEDULED":
      return "Scheduled";
    case "COMPLETED":
      return "Completed";
    case "MISSED":
      return "Missed";
    default:
      return status;
  }
}

function canJoin(consultation: DoctorConsultationSummary): boolean {
  return (
    consultation.status === "SCHEDULED" ||
    consultation.status === "ACTIVE"
  );
}

export default async function DoctorConsultationsPage() {
  const consultations = await getDoctorConsultations();

  const metrics = {
    active: consultations.filter((c) => c.status === "ACTIVE").length,
    scheduled: consultations.filter((c) => c.status === "SCHEDULED").length,
    completed: consultations.filter((c) => c.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-[#6b6b6b]">
          {formatDate(new Date(), "long")}
        </p>
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">
          Consultations
        </h1>
      </div>

      {consultations.length === 0 ? (
        <EmptyState
          title="No consultations yet"
          description="When patients book virtual appointments with you, the consultation rooms will appear here."
          action={
            <Button asChild>
              <Link href="/doctor/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      ) : (
        <>
          <Grid columns={3} gap="md">
            <MetricCard label="Live now" value={metrics.active} />
            <MetricCard label="Scheduled" value={metrics.scheduled} />
            <MetricCard label="Completed" value={metrics.completed} />
          </Grid>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <H2>All consultations</H2>
              <Link
                href="/doctor/dashboard"
                className="text-sm font-semibold text-[#2641FF] hover:underline"
              >
                Back to dashboard
              </Link>
            </div>

            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card key={consultation.id} hoverable className="border-slate-200 bg-white transition-all">
                  <CardBody className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle size="lg">
                            {consultation.patientName}
                          </CardTitle>
                          <Badge variant={statusVariant(consultation.status)}>
                            {statusLabel(consultation.status)}
                          </Badge>
                        </div>
                        <Body size="sm" muted>
                          {consultation.specialty ?? "General"} consultation
                        </Body>
                        <Text muted>
                          {formatDate(consultation.appointmentDate, "long")} at{" "}
                          {formatDate(consultation.appointmentStartTime, "time")}
                        </Text>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="info" outlined>
                          {consultation.meetingProvider}
                        </Badge>
                        {consultation.followUpRequired && (
                          <Badge variant="warning" outlined>
                            Follow-up needed
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Body size="sm" muted>{consultation.reasonForVisit}</Body>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <InfoChip
                        label="Appointment"
                        value={consultation.appointmentId.slice(0, 12)}
                      />
                      <InfoChip
                        label="Specialty"
                        value={consultation.specialty ?? "General"}
                      />
                      {consultation.diagnosis && (
                        <InfoChip label="Diagnosis" value={consultation.diagnosis} />
                      )}
                    </div>
                  </CardBody>

                  <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      {canJoin(consultation) ? (
                        <Badge variant="success" outlined>
                          Joinable
                        </Badge>
                      ) : (
                        <Badge variant="secondary" outlined>
                          {statusLabel(consultation.status)}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/doctor/consultations/${consultation.id}`}>
                          {canJoin(consultation) ? "Open room" : "View details"}
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────── */

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardBody>
        <Text muted className="uppercase tracking-[0.2em]">
          {label}
        </Text>
        <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
      </CardBody>
    </Card>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}
