"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  EmptyState,
  H1,
  H2,
  H3,
  Text,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { getConsultationById } from "../data";

function ConsultationRoomPage() {
  const params = useParams<{ consultationId: string }>();
  const consultation = getConsultationById(params.consultationId);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const callState = useMemo(
    () => ({
      title:
        consultation?.status === "live"
          ? "Live now"
          : consultation?.status === "completed"
            ? "Consultation completed"
            : "Waiting room",
      tone:
        consultation?.status === "live"
          ? "success"
          : consultation?.status === "completed"
            ? "secondary"
            : "primary",
    }),
    [consultation?.status],
  );

  if (!consultation) {
    return (
      <Layout>
        <Header>
          <Navbar
            logo={<h1 className="text-xl font-bold text-gray-900">GoodHealth</h1>}
          >
            <NavGroup>
              <NavLink href="/patient/consultations">Consultations</NavLink>
              <NavLink href="/patient/doctors">Doctors</NavLink>
            </NavGroup>
          </Navbar>
        </Header>
        <Main className="bg-slate-50">
          <PageContainer className="py-12">
            <EmptyState
              title="Consultation not found"
              description="The consultation ID in the URL does not match any assigned room."
              action={
                <Button asChild>
                  <Link href="/patient/consultations">Return to consultations</Link>
                </Button>
              }
            />
          </PageContainer>
        </Main>
      </Layout>
    );
  }

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
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={callState.tone as "success" | "secondary" | "primary"}>
                  {callState.title}
                </Badge>
                <Badge variant="info" outlined>
                  {consultation.provider}
                </Badge>
                <Badge variant="default" outlined>
                  Appointment {consultation.appointmentId}
                </Badge>
              </div>

              <H1>{consultation.doctorName}</H1>
              <Body size="lg" muted className="max-w-2xl">
                {consultation.specialty} consultation for {consultation.patientName}.
                The room is restricted to the assigned participants only.
              </Body>

              <div className="grid gap-3 sm:grid-cols-3">
                <RoomStat label="Scheduled" value={`${consultation.dateLabel} at ${consultation.timeLabel}`} />
                <RoomStat label="Duration" value={consultation.duration} />
                <RoomStat label="Connection" value={consultation.connection} />
              </div>
            </div>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle size="lg">Join control</CardTitle>
                <Body size="sm" muted className="mt-1">
                  This secure room uses a Daily.co-style video session.
                </Body>
              </CardHeader>
              <CardBody className="space-y-4">
                <AppointmentInfo
                  doctorName={consultation.doctorName}
                  specialty={consultation.specialty}
                  date={consultation.dateLabel}
                  time={consultation.timeLabel}
                  type="video"
                  status={
                    consultation.status === "live"
                      ? "confirmed"
                      : consultation.status === "completed"
                        ? "completed"
                        : "pending"
                  }
                  location={consultation.location}
                  notes={consultation.reason}
                />

                <Alert variant="warning">
                  <AlertTitle>Assigned access only</AlertTitle>
                  <AlertDescription>
                    Only the assigned patient and doctor can join this room.
                  </AlertDescription>
                </Alert>
              </CardBody>
              <CardFooter className="grid gap-3">
                <Button className="w-full">Join consultation</Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/patient/consultations">Back to consultations</Link>
                </Button>
              </CardFooter>
            </Card>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
            <section className="space-y-6">
              <Card className="overflow-hidden border-slate-200 bg-slate-950 text-white shadow-2xl shadow-slate-950/10">
                <CardHeader className="border-white/10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-white">Consultation room</CardTitle>
                      <Body size="sm" className="mt-1 text-slate-300">
                        Camera, microphone, and screen share controls are ready.
                      </Body>
                    </div>
                    <Badge variant="success">Secure room</Badge>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
                    <div className="relative min-h-[320px] rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_38%),linear-gradient(160deg,_#0f172a,_#020617)] p-5">
                      <div className="absolute inset-0 rounded-3xl border border-white/5" />
                      <div className="relative flex h-full flex-col justify-between">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-[0.25em] text-slate-300">
                              {consultation.roomName}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-white">
                              {consultation.status === "live"
                                ? "Live consultation"
                                : consultation.status === "completed"
                                  ? "Recorded session"
                                  : "Waiting room"}
                            </div>
                          </div>
                          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                            {consultation.connection} connection
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <ParticipantTile
                            label={consultation.patientName}
                            role="Patient"
                            accent="from-sky-500 to-cyan-400"
                          />
                          <ParticipantTile
                            label={consultation.doctorName}
                            role="Doctor"
                            accent="from-emerald-500 to-teal-400"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant={micMuted ? "secondary" : "outline"}
                            onClick={() => setMicMuted((current) => !current)}
                          >
                            {micMuted ? "Unmute" : "Mute"}
                          </Button>
                          <Button
                            type="button"
                            variant={cameraOff ? "secondary" : "outline"}
                            onClick={() => setCameraOff((current) => !current)}
                          >
                            {cameraOff ? "Turn camera on" : "Turn camera off"}
                          </Button>
                          <Button
                            type="button"
                            variant={screenShare ? "secondary" : "outline"}
                            onClick={() => setScreenShare((current) => !current)}
                          >
                            {screenShare ? "Stop sharing" : "Share screen"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                        <div className="text-xs uppercase tracking-[0.25em] text-slate-300">
                          Session status
                        </div>
                        <div className="mt-2 text-2xl font-bold text-white">
                          {consultation.status === "live"
                            ? "In progress"
                            : consultation.status === "completed"
                              ? "Completed"
                              : "Waiting to join"}
                        </div>
                        <div className="mt-2 text-sm text-slate-300">
                          {consultation.reason}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Text className="font-semibold text-white">
                          Controls
                        </Text>
                        <ControlRow label="Microphone" value={micMuted ? "Muted" : "Live"} />
                        <ControlRow label="Camera" value={cameraOff ? "Off" : "On"} />
                        <ControlRow label="Screen share" value={screenShare ? "Sharing" : "Idle"} />
                      </div>

                      <Alert variant="info">
                        <AlertTitle>Video note</AlertTitle>
                        <AlertDescription>
                          The room is intentionally simple so patients can focus
                          on the conversation.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle>Consultation notes</CardTitle>
                </CardHeader>
                <CardBody className="grid gap-4 md:grid-cols-2">
                  <NotesBlock title="Reason for visit" text={consultation.reason} />
                  <NotesBlock title="Clinical notes" text={consultation.notes} />
                  <NotesBlock
                    title="Recommended follow-up"
                    text={consultation.recommendedFollowUp ?? consultation.followUp}
                  />
                  <NotesBlock
                    title="Prescription / outcome"
                    text={consultation.prescription ?? "No prescription recorded."}
                  />
                </CardBody>
              </Card>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle size="lg">Visit summary</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid gap-3">
                    <SummaryRow label="Doctor" value={consultation.doctorName} />
                    <SummaryRow label="Specialty" value={consultation.specialty} />
                    <SummaryRow label="Date" value={consultation.dateLabel} />
                    <SummaryRow label="Time" value={consultation.timeLabel} />
                    <SummaryRow label="Room" value={consultation.roomName} />
                  </div>

                  <div className="space-y-2">
                    <Text className="font-semibold text-gray-900">
                      Participants
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {consultation.participants.map((participant) => (
                        <Badge key={participant} variant="default" outlined size="sm">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Text className="font-semibold text-gray-900">
                      Checklist
                    </Text>
                    <div className="space-y-2">
                      {consultation.checklist.map((item) => (
                        <ChecklistItem key={item} text={item} />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setNotesSaved(true)}
                  >
                    {notesSaved ? "Notes saved" : "Save notes"}
                  </Button>
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

function ParticipantTile({
  label,
  role,
  accent,
}: {
  label: string;
  role: string;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className={cn("flex h-24 items-center justify-center rounded-2xl bg-gradient-to-br", accent)}>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/70">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-sm text-slate-200">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
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

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
        ✓
      </div>
      <div className="text-sm text-slate-700">{text}</div>
    </div>
  );
}

export default ConsultationRoomPage;
