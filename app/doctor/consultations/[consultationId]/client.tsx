"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Badge,
  Body,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  H1,
  H2,
  Text,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DailyCallView } from "@/components/consultations/daily-call-view";
import type { DoctorConsultationSummary } from "../actions";

type Props = {
  consultation: DoctorConsultationSummary;
};

type Phase = "room" | "ended" | "completed";

export function DoctorConsultationRoomClient({ consultation }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("room");

  const statusVariant =
    consultation.status === "ACTIVE"
      ? ("success" as const)
      : consultation.status === "COMPLETED"
        ? ("secondary" as const)
        : ("primary" as const);

  const statusLabel =
    consultation.status === "ACTIVE"
      ? "Live now"
      : consultation.status === "COMPLETED"
        ? "Completed"
        : "Waiting room";

  const handleCompleted = () => {
    setPhase("completed");
  };

  const handleLeft = () => {
    setPhase("ended");
  };

  const handleBack = () => {
    router.push("/doctor/consultations");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          <Badge variant="info" outlined>
            {consultation.meetingProvider}
          </Badge>
          <Badge variant="default" outlined>
            Appointment {consultation.appointmentId.slice(0, 12)}
          </Badge>
        </div>

        <H1>Patient: {consultation.patientName}</H1>
        <Body size="lg" muted className="max-w-2xl">
          {consultation.specialty ?? "General"} consultation. You are the
          assigned doctor and call owner.
        </Body>

        <div className="grid gap-3 sm:grid-cols-4">
          <RoomStat
            label="Scheduled"
            value={`${formatDate(consultation.appointmentDate, "long")}`}
          />
          <RoomStat
            label="Time"
            value={formatDate(consultation.appointmentStartTime, "time")}
          />
          <RoomStat label="Status" value={statusLabel} />
          <RoomStat label="Provider" value={consultation.meetingProvider} />
        </div>
      </div>

      {/* Call view or ended/completed state */}
      <section id="call-view">
        {phase === "completed" ? (
          <div className="space-y-6">
            <Alert variant="success">
              <AlertTitle>Consultation completed</AlertTitle>
              <AlertDescription>
                The consultation has been ended and notes have been saved. The
                patient has been notified.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/doctor/consultations">
                  Back to consultations
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/doctor/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        ) : phase === "ended" ? (
          <div className="space-y-6">
            <Alert variant="info">
              <AlertTitle>You left the room</AlertTitle>
              <AlertDescription>
                You can rejoin the room as long as the consultation is still
                active. Note: as the call owner, leaving does not end the
                consultation for the patient.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button onClick={() => setPhase("room")}>Rejoin room</Button>
              <Button variant="outline" onClick={handleBack}>
                Back to consultations
              </Button>
            </div>
          </div>
        ) : (
          <DailyCallView
            consultationId={consultation.id}
            isDoctor={true}
            onCompleted={handleCompleted}
            onLeft={handleLeft}
          />
        )}
      </section>

      {/* Info + Notes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Patient info */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Patient information</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-3">
              <SummaryRow label="Patient" value={consultation.patientName} />
              <SummaryRow
                label="Reason for visit"
                value={consultation.reasonForVisit}
              />
              <SummaryRow
                label="Symptoms"
                value={consultation.symptoms ?? "None reported"}
              />
              {consultation.diagnosis && (
                <SummaryRow label="Diagnosis" value={consultation.diagnosis} />
              )}
              {consultation.recommendations && (
                <SummaryRow
                  label="Recommendations"
                  value={consultation.recommendations}
                />
              )}
            </div>
          </CardBody>
        </Card>

        {/* Notes summary */}
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Consultation notes</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <NotesBlock
              title="Diagnosis"
              text={consultation.diagnosis ?? "No diagnosis recorded yet."}
            />
            <NotesBlock
              title="Recommendations"
              text={
                consultation.recommendations ?? "No recommendations yet."
              }
            />
            <NotesBlock
              title="Follow-up"
              text={
                consultation.followUpRequired
                  ? consultation.followUpNotes ?? "Follow-up required."
                  : "No follow-up needed."
              }
            />
          </CardBody>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const el = document.getElementById("call-view");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {phase === "room" ? "Scroll to video room" : "View room"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────── */

function RoomStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function NotesBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </div>
      <p className="mt-2 text-sm text-slate-700">{text}</p>
    </div>
  );
}
