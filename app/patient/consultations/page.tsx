"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  Grid,
  H1,
  H2,
  H3,
  Stack,
  Text,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { consultationSessions } from "./data";

function VideoConsultationsPage() {
  const [selectedId, setSelectedId] = useState(consultationSessions[0]?.id ?? "");
  const selectedSession =
    consultationSessions.find((session) => session.id === selectedId) ??
    consultationSessions[0] ??
    null;

  const metrics = useMemo(
    () => ({
      live: consultationSessions.filter((session) => session.status === "live")
        .length,
      scheduled: consultationSessions.filter(
        (session) => session.status === "scheduled",
      ).length,
      completed: consultationSessions.filter(
        (session) => session.status === "completed",
      ).length,
    }),
    [],
  );

  return (
    <Layout>
      <Header>
        <Navbar
          logo={
            <div>
              <div className="text-xl font-bold text-gray-900">
                GoodHealth
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Video Consultations
              </div>
            </div>
          }
        >
          <NavGroup>
            <NavLink href="/patient/doctors">Doctors</NavLink>
            <NavLink href="/patient/appointments">Appointments</NavLink>
            <NavLink href="/patient/consultations">Consultations</NavLink>
            <NavLink href="/patient/notifications">Notifications</NavLink>
            <NavLink href="/patient/membership">Membership</NavLink>
          </NavGroup>
        </Navbar>
      </Header>

      <Main className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.10),_transparent_26%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <PageContainer maxWidth="2xl" padding="lg" className="space-y-10">
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/10 sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.24),transparent_36%,transparent_68%,rgba(34,197,94,0.20))]" />
            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-12 left-1/3 h-36 w-36 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-6">
                <Badge variant="info" outlined className="w-fit bg-white/10 text-cyan-50 border-white/20">
                  Secure assigned access
                </Badge>
                <div className="max-w-2xl space-y-4">
                  <H1 className="text-white">
                    Join video consultations without the friction.
                  </H1>
                  <Body size="lg" className="max-w-2xl text-slate-200">
                    Every virtual consultation is tied to an appointment and
                    protected room. See what&apos;s live now, what&apos;s next,
                    and what was completed recently.
                  </Body>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <HeroStat label="Live now" value={metrics.live} />
                  <HeroStat label="Scheduled" value={metrics.scheduled} />
                  <HeroStat label="Completed" value={metrics.completed} />
                </div>
              </div>

              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur-md">
                <CardHeader className="border-white/10">
                  <CardTitle className="text-white">Consultation rules</CardTitle>
                  <Body size="sm" className="text-slate-200">
                    Only the assigned patient and doctor may join the room.
                  </Body>
                </CardHeader>
                <CardBody className="space-y-3">
                  <RuleItem title="Linked to appointment" description="Each room maps back to a scheduled visit." />
                  <RuleItem title="Valid room" description="The session uses a secure Daily.co room." />
                  <RuleItem title="Saved notes" description="Clinical notes are captured before completion." />
                </CardBody>
              </Card>
            </div>
          </section>

          <Alert variant="info">
            <AlertTitle>Fast path</AlertTitle>
            <AlertDescription>
              Pick a consultation from the list below, or open the live room if
              you are ready to join now.
            </AlertDescription>
          </Alert>

          <Grid columns={3} gap="md">
            <MetricCard label="Live rooms" value={metrics.live} />
            <MetricCard label="Upcoming sessions" value={metrics.scheduled} />
            <MetricCard label="Follow-ups recorded" value={metrics.completed} />
          </Grid>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.85fr)]">
            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <H2>Consultation queue</H2>
                  <Body muted>
                    Your upcoming rooms, the live session, and recent completed
                    care.
                  </Body>
                </div>
                <Button asChild variant="outline">
                  <Link href="/patient/doctors">Find another doctor</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {consultationSessions.map((session) => {
                  const active = selectedSession?.id === session.id;
                  const statusVariant =
                    session.status === "live"
                      ? "success"
                      : session.status === "scheduled"
                        ? "primary"
                        : "secondary";

                  return (
                    <Card
                      key={session.id}
                      hoverable
                      className={cn(
                        "cursor-pointer border-slate-200 bg-white transition-all",
                        active && "border-sky-500 ring-2 ring-sky-500/15",
                      )}
                      onClick={() => setSelectedId(session.id)}
                    >
                      <CardBody className="space-y-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <CardTitle size="lg">{session.doctorName}</CardTitle>
                              <Badge variant={statusVariant}>{session.status}</Badge>
                              <Badge variant="default" outlined>
                                {session.duration}
                              </Badge>
                            </div>
                            <Body size="sm" muted>
                              {session.specialty} consultation
                            </Body>
                            <Text muted>
                              {session.dateLabel} at {session.timeLabel}
                            </Text>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="info" outlined>
                              {session.provider}
                            </Badge>
                            <Badge variant="default" outlined>
                              {session.location}
                            </Badge>
                          </div>
                        </div>

                        <Body size="sm" muted>
                          {session.reason}
                        </Body>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <InfoChip label="Appointment" value={session.appointmentId} />
                          <InfoChip label="Room" value={session.roomName} />
                          <InfoChip label="Connection" value={session.connection} />
                          <InfoChip label="Patient" value={session.patientName} />
                        </div>
                      </CardBody>

                      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                          {session.canJoin ? (
                            <Badge variant="success" outlined>
                              Joinable
                            </Badge>
                          ) : (
                            <Badge variant="warning" outlined>
                              Read only
                            </Badge>
                          )}
                          <Badge variant="primary" outlined>
                            {session.followUp}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedId(session.id)}
                          >
                            Review
                          </Button>
                          {session.canJoin || session.status === "completed" ? (
                            <Button asChild size="sm">
                              <Link href={`/patient/consultations/${session.id}`}>
                                {session.status === "completed"
                                  ? "View summary"
                                  : "Open room"}
                              </Link>
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Locked
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle size="lg">Session details</CardTitle>
                      <Body size="sm" muted className="mt-1">
                        A quick view of the consultation you selected.
                      </Body>
                    </div>
                    <Badge variant="info" outlined>
                      Live preview
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  {selectedSession ? (
                    <Stack spacing="lg">
                      <AppointmentInfo
                        doctorName={selectedSession.doctorName}
                        specialty={selectedSession.specialty}
                        date={selectedSession.dateLabel}
                        time={selectedSession.timeLabel}
                        type="video"
                        status={
                          selectedSession.status === "live"
                            ? "confirmed"
                            : selectedSession.status === "completed"
                              ? "completed"
                              : "pending"
                        }
                        location={selectedSession.location}
                        notes={selectedSession.notes}
                      />

                      <div className="space-y-2">
                        <Text className="font-semibold text-gray-900">
                          Join checklist
                        </Text>
                        <div className="space-y-2">
                          {selectedSession.checklist.map((item) => (
                            <ChecklistItem key={item} text={item} />
                          ))}
                        </div>
                      </div>

                      <Alert variant="warning">
                        <AlertTitle>Only assigned participants</AlertTitle>
                        <AlertDescription>
                          The room is restricted to {selectedSession.participants.join(" and ")}.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-3">
                        <Button asChild variant="outline">
                          <Link href={`/patient/consultations/${selectedSession.id}`}>
                            Open room
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link href="/patient/appointments">Book next visit</Link>
                        </Button>
                      </div>
                    </Stack>
                  ) : (
                    <EmptyState
                      title="No consultation selected"
                      description="Choose a session from the queue to see the room details."
                    />
                  )}
                </CardBody>
              </Card>

              <Card className="border-slate-200 bg-gradient-to-br from-sky-50 to-emerald-50">
                <CardBody className="space-y-3">
                  <Badge variant="success" outlined>
                    Follow-up
                  </Badge>
                  <H3>After each video visit</H3>
                  <Body size="sm" muted>
                    Doctors can recommend a physical appointment when they need
                    an in-person exam or procedure.
                  </Body>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/patient/appointments">Schedule follow-up</Link>
                  </Button>
                </CardBody>
              </Card>
            </aside>
          </div>
        </PageContainer>
      </Main>

      <Footer>
        <Container className="py-8">
          <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>GoodHealth video consultations</p>
            <p>Simple, secure, and restricted to the assigned care team.</p>
          </div>
        </Container>
      </Footer>
    </Layout>
  );
}

function HeroStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 shadow-sm backdrop-blur">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function RuleItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-200">{description}</div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
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

export default VideoConsultationsPage;
