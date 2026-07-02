"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layout,
  Header,
  Main,
  Footer,
  PageContainer,
  Container,
  Navbar,
  NavGroup,
  NavLink,
} from "@/components/layout";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AppointmentInfo,
  Badge,
  Body,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  H1,
  H2,
  H3,
  Text,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DailyCallView } from "@/components/consultations/daily-call-view";
import type { ConsultationSummary } from "../actions";

type Props = {
  consultation: ConsultationSummary;
};

type Phase = "room" | "ended" | "completed";

export function ConsultationRoomClient({ consultation }: Props) {
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
        ? "Consultation completed"
        : "Waiting room";

  const handleCompleted = () => {
    setPhase("completed");
  };

  const handleLeft = () => {
    setPhase("ended");
  };

  const handleBack = () => {
    router.push("/patient/consultations");
  };

  return (
    <Layout>
      <Header>
        <Navbar
          logo={
            <div>
              <div className="text-xl font-bold text-gray-900">GoodHealth</div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Video Room
              </div>
            </div>
          }
        >
          <NavGroup>
            <NavLink href="/patient/consultations">Consultations</NavLink>
            <NavLink href="/patient/appointments">Appointments</NavLink>
            <NavLink href="/patient/doctors">Doctors</NavLink>
          </NavGroup>
        </Navbar>
      </Header>

      <Main className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.10),_transparent_26%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <PageContainer maxWidth="2xl" padding="lg" className="space-y-8">
          {/* Header */}
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
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

              <H1>{consultation.doctorName}</H1>
              <Body size="lg" muted className="max-w-2xl">
                {consultation.specialty ?? "General"} consultation for{" "}
                {consultation.patientName}. The room is restricted to the assigned
                participants only.
              </Body>

              <div className="grid gap-3 sm:grid-cols-3">
                <RoomStat
                  label="Scheduled"
                  value={`${formatDate(consultation.appointmentDate, "long")} at ${formatDate(consultation.appointmentStartTime, "time")}`}
                />
                <RoomStat label="Status" value={statusLabel} />
                <RoomStat label="Provider" value={consultation.meetingProvider} />
              </div>
            </div>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle size="lg">Join control</CardTitle>
                <Body size="sm" muted className="mt-1">
                  This secure room uses a Daily.co video session.
                </Body>
              </CardHeader>
              <CardBody className="space-y-4">
                <AppointmentInfo
                  doctorName={consultation.doctorName}
                  specialty={consultation.specialty ?? undefined}
                  date={formatDate(consultation.appointmentDate, "long")}
                  time={formatDate(consultation.appointmentStartTime, "time")}
                  type="video"
                  status={
                    consultation.status === "ACTIVE"
                      ? "confirmed"
                      : consultation.status === "COMPLETED"
                        ? "completed"
                        : "pending"
                  }
                  location="Secure video room"
                  notes={consultation.reasonForVisit}
                />

                <Alert variant="warning">
                  <AlertTitle>Assigned access only</AlertTitle>
                  <AlertDescription>
                    Only the assigned patient and doctor can join this room.
                  </AlertDescription>
                </Alert>
              </CardBody>
              <CardFooter className="grid gap-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    const el = document.getElementById("call-view");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Scroll to video room
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/patient/consultations">Back to consultations</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>

          {/* Call view or ended state */}
          <section id="call-view">
            {phase === "completed" ? (
              <div className="space-y-6">
                <Alert variant="success">
                  <AlertTitle>Consultation completed</AlertTitle>
                  <AlertDescription>
                    Your doctor has ended the consultation and saved clinical notes.
                    You can review the summary below.
                  </AlertDescription>
                </Alert>
                <CompletedSummary consultation={consultation} />
              </div>
            ) : phase === "ended" ? (
              <div className="space-y-6">
                <Alert variant="info">
                  <AlertTitle>You left the consultation</AlertTitle>
                  <AlertDescription>
                    You can rejoin the room as long as the consultation is still
                    active, or return to your consultations list.
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
                isDoctor={consultation.isDoctor}
                onCompleted={handleCompleted}
                onLeft={handleLeft}
              />
            )}
          </section>

          {/* Notes section */}
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>Consultation notes</CardTitle>
            </CardHeader>
            <CardBody className="grid gap-4 md:grid-cols-2">
              <NotesBlock
                title="Reason for visit"
                text={consultation.reasonForVisit}
              />
              <NotesBlock
                title="Diagnosis"
                text={consultation.diagnosis ?? "No diagnosis recorded yet."}
              />
              <NotesBlock
                title="Recommendations"
                text={
                  consultation.recommendations ??
                  "No recommendations recorded yet."
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
          </Card>

          {/* Sidebar */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
            <div />
            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle size="lg">Visit summary</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid gap-3">
                    <SummaryRow label="Doctor" value={consultation.doctorName} />
                    <SummaryRow
                      label="Specialty"
                      value={consultation.specialty ?? "General"}
                    />
                    <SummaryRow
                      label="Date"
                      value={formatDate(consultation.appointmentDate, "long")}
                    />
                    <SummaryRow
                      label="Time"
                      value={formatDate(consultation.appointmentStartTime, "time")}
                    />
                    <SummaryRow
                      label="Room"
                      value={consultation.meetingRoomId ?? "Not provisioned"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Text className="font-semibold text-gray-900">
                      Participants
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default" outlined size="sm">
                        {consultation.patientName}
                      </Badge>
                      <Badge variant="default" outlined size="sm">
                        {consultation.doctorName}
                      </Badge>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-slate-200 bg-gradient-to-br from-sky-50 to-emerald-50">
                <CardBody className="space-y-3">
                  <Badge variant="success" outlined>
                    Post visit
                  </Badge>
                  <H3>Continue care after the call</H3>
                  <Body size="sm" muted>
                    If the doctor recommends an in-person follow-up, you can
                    book the next appointment right away.
                  </Body>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/patient/appointments">Schedule follow-up</Link>
                  </Button>
                </CardBody>
              </Card>

              <Card className="border-slate-200 bg-white">
                <CardBody className="space-y-3">
                  <Badge variant="info" outlined>
                    Timestamp
                  </Badge>
                  <H2>{formatDate(new Date(), "full")}</H2>
                </CardBody>
              </Card>
            </aside>
          </div>
        </PageContainer>
      </Main>

      <Footer>
        <Container className="py-8">
          <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>GoodHealth consultation room</p>
            <p>Only assigned participants can join this session.</p>
          </div>
        </Container>
      </Footer>
    </Layout>
  );
}

/* ── Sub-components ───────────────────────────────────────────────────── */

function CompletedSummary({ consultation }: { consultation: ConsultationSummary }) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle>Clinical notes from your doctor</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4">
        {consultation.diagnosis && (
          <div className="space-y-1">
            <Text className="font-semibold text-gray-900">Diagnosis</Text>
            <Body muted>{consultation.diagnosis}</Body>
          </div>
        )}
        {consultation.recommendations && (
          <div className="space-y-1">
            <Text className="font-semibold text-gray-900">Recommendations</Text>
            <Body muted>{consultation.recommendations}</Body>
          </div>
        )}
        {consultation.followUpRequired && consultation.followUpNotes && (
          <div className="space-y-1">
            <Text className="font-semibold text-gray-900">Follow-up notes</Text>
            <Body muted>{consultation.followUpNotes}</Body>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <Button asChild>
            <Link href="/patient/consultations">Back to consultations</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/patient/appointments">Schedule follow-up</Link>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

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
