"use client";

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
  Badge,
  Body,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  H1,
  H2,
  H3,
  Stack,
  Text,
} from "@/components/shared";
import { Button } from "@/components/ui/button";

type QueueItem = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "review" | "action";
  href: string;
  label: string;
};

const metrics = [
  { label: "Active patients", value: "12,480", delta: "+6.2%" },
  { label: "Verified doctors", value: "384", delta: "+18 this week" },
  { label: "Active memberships", value: "8,940", delta: "92% renewal" },
  { label: "Open appointments", value: "126", delta: "14 conflicts" },
];

const queueItems: QueueItem[] = [
  {
    id: "q-1",
    title: "Doctor verification backlog",
    description:
      "24 new provider applications are waiting for review, including 6 priority cases.",
    status: "pending",
    href: "/admin/doctors",
    label: "Review doctors",
  },
  {
    id: "q-2",
    title: "Membership plan updates",
    description:
      "2 plans need pricing or feature adjustments before the next billing cycle.",
    status: "review",
    href: "/admin/memberships",
    label: "Manage plans",
  },
  {
    id: "q-3",
    title: "Appointment conflicts",
    description:
      "14 scheduling overlaps were flagged overnight across patient and doctor calendars.",
    status: "action",
    href: "/admin/appointments",
    label: "Resolve conflicts",
  },
];

const activityFeed = [
  {
    time: "5 min ago",
    title: "Dr. Hassan verified",
    detail: "Cardiology profile approved and added to search results.",
  },
  {
    time: "18 min ago",
    title: "Membership plan updated",
    detail: "Annual pricing adjusted for the Plus tier.",
  },
  {
    time: "42 min ago",
    title: "Appointment conflict resolved",
    detail: "Two overlapping visits rescheduled successfully.",
  },
  {
    time: "1 hr ago",
    title: "Patient account reactivated",
    detail: "Access restored after support review.",
  },
];

function AdminDashboardPage() {
  return (
    <Layout>
      <Header>
        <Navbar
          logo={
            <div>
              <div className="text-xl font-bold text-gray-900">GoodHealth</div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Admin Dashboard
              </div>
            </div>
          }
        >
          <NavGroup>
            <NavLink href="/admin/dashboard">Dashboard</NavLink>
            <NavLink href="/admin/doctors">Doctors</NavLink>
            <NavLink href="/admin/patients">Patients</NavLink>
            <NavLink href="/admin/memberships">Memberships</NavLink>
            <NavLink href="/admin/appointments">Appointments</NavLink>
            <NavLink href="/admin/analytics">Analytics</NavLink>
          </NavGroup>
        </Navbar>
      </Header>

      <Main className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.10),_transparent_24%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <PageContainer maxWidth="2xl" padding="lg" className="space-y-10">
          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/10 sm:px-8 sm:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-6">
                <Badge variant="info" outlined className="w-fit bg-white/10 text-cyan-50 border-white/20">
                  Platform operations
                </Badge>
                <div className="max-w-2xl space-y-4">
                  <H1 className="text-white">Run the healthcare platform from one command center.</H1>
                  <Body size="lg" className="max-w-2xl text-slate-200">
                    Monitor doctor verification, membership health, patient
                    activity, and appointment operations without leaving the
                    admin workspace.
                  </Body>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {metrics.map((metric) => (
                    <MetricStat key={metric.label} {...metric} />
                  ))}
                </div>
              </div>

              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur-md">
                <CardHeader className="border-white/10">
                  <CardTitle className="text-white">Today&apos;s priorities</CardTitle>
                  <Body size="sm" className="text-slate-200">
                    Focus on the highest-impact admin tasks first.
                  </Body>
                </CardHeader>
                <CardBody className="space-y-3">
                  <PriorityLine label="Verification backlog" value={24} />
                  <PriorityLine label="Open conflicts" value={14} />
                  <PriorityLine label="Plans needing review" value={2} />
                </CardBody>
              </Card>
            </div>
          </section>

          <Alert variant="info">
            <AlertTitle>Admin access</AlertTitle>
            <AlertDescription>
              Admins can manage users, doctors, memberships, appointments, and
              operational analytics, but cannot participate in consultations.
            </AlertDescription>
          </Alert>

          <Grid columns={4} gap="md">
            <Card>
              <CardBody>
                <Text muted className="uppercase tracking-[0.2em]">
                  Pending doctors
                </Text>
                <div className="mt-2 text-2xl font-bold text-slate-950">24</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text muted className="uppercase tracking-[0.2em]">
                  Suspended users
                </Text>
                <div className="mt-2 text-2xl font-bold text-slate-950">7</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text muted className="uppercase tracking-[0.2em]">
                  Membership churn
                </Text>
                <div className="mt-2 text-2xl font-bold text-slate-950">3.2%</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Text muted className="uppercase tracking-[0.2em]">
                  Appointments today
                </Text>
                <div className="mt-2 text-2xl font-bold text-slate-950">186</div>
              </CardBody>
            </Card>
          </Grid>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <H2>Operational queue</H2>
                  <Body muted>
                    Review the items that need action before they affect the
                    patient experience.
                  </Body>
                </div>
                <Button asChild variant="outline">
                  <Link href="/admin/analytics">Open analytics</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {queueItems.map((item) => (
                  <Card key={item.id} hoverable className="border-slate-200 bg-white">
                    <CardBody className="space-y-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle size="lg">{item.title}</CardTitle>
                            <Badge variant={queueBadgeVariant(item.status)}>
                              {queueLabel(item.status)}
                            </Badge>
                          </div>
                          <Body size="sm" muted>
                            {item.description}
                          </Body>
                        </div>
                        <Badge variant="default" outlined>
                          Admin action
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={item.href}>{item.label}</Link>
                        </Button>
                        <Button type="button" size="sm" variant="ghost">
                          Dismiss
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle size="lg">Live activity</CardTitle>
                  <Body size="sm" muted className="mt-1">
                    Recent platform events and admin actions.
                  </Body>
                </CardHeader>
                <CardBody>
                  <Stack spacing="md">
                    {activityFeed.map((entry) => (
                      <div
                        key={entry.title}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {entry.time}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-950">
                          {entry.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {entry.detail}
                        </div>
                      </div>
                    ))}
                  </Stack>
                </CardBody>
              </Card>

              <Card className="border-slate-200 bg-gradient-to-br from-sky-50 to-emerald-50">
                <CardBody className="space-y-3">
                  <Badge variant="success" outlined>
                    Shortcuts
                  </Badge>
                  <H3>Jump to key admin areas</H3>
                  <Body size="sm" muted>
                    Use these quick actions to get to the management surfaces
                    most teams use every day.
                  </Body>
                  <div className="grid gap-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/doctors">Verify doctors</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/memberships">Manage memberships</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/admin/appointments">Review appointments</Link>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </aside>
          </div>
        </PageContainer>
      </Main>

      <Footer>
        <Container className="py-8">
          <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>GoodHealth admin dashboard</p>
            <p>Manage operations, providers, and patient services.</p>
          </div>
        </Container>
      </Footer>
    </Layout>
  );
}

function MetricStat({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 shadow-sm backdrop-blur">
      <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-200">{delta}</div>
    </div>
  );
}

function PriorityLine({ label, value }: { label: string; value: number }) {
  const max = 30;
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-200">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function queueBadgeVariant(status: QueueItem["status"]) {
  if (status === "pending") return "warning";
  if (status === "review") return "info";
  return "error";
}

function queueLabel(status: QueueItem["status"]) {
  if (status === "pending") return "Pending";
  if (status === "review") return "Review";
  return "Action needed";
}

export default AdminDashboardPage;
