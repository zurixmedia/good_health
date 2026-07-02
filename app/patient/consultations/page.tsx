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
import { formatDate } from "@/lib/utils";
import { getMyConsultations } from "./actions";
import type { ConsultationSummary } from "./actions";

export const metadata = {
  title: "Video Consultations | GoodHealth",
  description:
    "View and join your video consultations, review past sessions, and manage your upcoming appointments.",
};

function statusVariant(status: string): "success" | "primary" | "secondary" | "warning" | "default" {
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

function canJoin(consultation: ConsultationSummary): boolean {
  return (
    consultation.status === "SCHEDULED" ||
    consultation.status === "ACTIVE"
  );
}

export default async function VideoConsultationsPage() {
  const consultations = await getMyConsultations();

  const metrics = {
    active: consultations.filter((c) => c.status === "ACTIVE").length,
    scheduled: consultations.filter((c) => c.status === "SCHEDULED").length,
    completed: consultations.filter((c) => c.status === "COMPLETED").length,
  };

  const selectedId = consultations[0]?.id ?? "";

  return (
    <Layout>
      <Header>
        <Navbar
          logo={
            <div>
              <div className="text-xl font-bold text-gray-900">GoodHealth</div>
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
          </NavGroup>
        </Navbar>
      </Header>

      <Main className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.10),_transparent_26%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <PageContainer maxWidth="2xl" padding="lg" className="space-y-10">
          {/* Hero */}
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
                  <HeroStat label="Live now" value={metrics.active} />
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

          {consultations.length === 0 ? (
            <EmptyState
              title="No consultations yet"
              description="When you book a virtual appointment, the consultation room will appear here."
              action={
                <Button asChild>
                  <Link href="/patient/doctors">Find a doctor</Link>
                </Button>
              }
            />
          ) : (
            <>
              <Alert variant="info">
                <AlertTitle>Fast path</AlertTitle>
                <AlertDescription>
                  Pick a consultation from the list below, or open the live room if
                  you are ready to join now.
                </AlertDescription>
              </Alert>

              <Grid columns={3} gap="md">
                <MetricCard label="Live rooms" value={metrics.active} />
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
                    {consultations.map((consultation) => (
                      <Card
                        key={consultation.id}
                        hoverable
                        className="border-slate-200 bg-white transition-all"
                      >
                        <CardBody className="space-y-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <CardTitle size="lg">{consultation.doctorName}</CardTitle>
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
                              <Badge variant="default" outlined>
                                {consultation.isDoctor ? "Doctor view" : "Patient view"}
                              </Badge>
                            </div>
                          </div>

                          <Body size="sm" muted>
                            {consultation.reasonForVisit}
                          </Body>

                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            <InfoChip label="Appointment" value={consultation.appointmentId.slice(0, 12)} />
                            <InfoChip label="Specialty" value={consultation.specialty ?? "General"} />
                            <InfoChip label="Patient" value={consultation.patientName} />
                          </div>
                        </CardBody>

                        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-2">
                            {canJoin(consultation) ? (
                              <Badge variant="success" outlined>
                                Joinable
                              </Badge>
                            ) : (
                              <Badge variant="warning" outlined>
                                Read only
                              </Badge>
                            )}
                            {consultation.followUpRequired && (
                              <Badge variant="primary" outlined>
                                Follow-up needed
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {canJoin(consultation) ? (
                              <Button asChild size="sm">
                                <Link href={`/patient/consultations/${consultation.id}`}>
                                  Open room
                                </Link>
                              </Button>
                            ) : (
                              <Button asChild size="sm">
                                <Link href={`/patient/consultations/${consultation.id}`}>
                                  View summary
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>

                <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                  <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle size="lg">Selected session</CardTitle>
                          <Body size="sm" muted className="mt-1">
                            A quick view of the most recent consultation.
                          </Body>
                        </div>
                        <Badge variant="info" outlined>
                          Preview
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <ConsultationPreview consultation={consultations[0]} />
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
            </>
          )}
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

/* ── Sub-components ───────────────────────────────────────────────────── */

function ConsultationPreview({
  consultation,
}: {
  consultation: ConsultationSummary;
}) {
  return (
    <Stack spacing="lg">
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

      {consultation.diagnosis && (
        <div className="space-y-2">
          <Text className="font-semibold text-gray-900">Diagnosis</Text>
          <Body size="sm" muted>{consultation.diagnosis}</Body>
        </div>
      )}
      {consultation.recommendations && (
        <div className="space-y-2">
          <Text className="font-semibold text-gray-900">Recommendations</Text>
          <Body size="sm" muted>{consultation.recommendations}</Body>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline">
          <Link href={`/patient/consultations/${consultation.id}`}>Open room</Link>
        </Button>
        <Button asChild>
          <Link href="/patient/appointments">Book next visit</Link>
        </Button>
      </div>
    </Stack>
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
