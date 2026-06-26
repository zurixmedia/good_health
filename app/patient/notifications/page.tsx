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
import { cn, formatDate } from "@/lib/utils";
import { notificationItems, type NotificationCategory } from "./data";

const categories: Array<"all" | NotificationCategory> = [
  "all",
  "appointments",
  "consultations",
  "membership",
  "system",
];

function NotificationsPage() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof categories)[number]>("all");
  const [selectedId, setSelectedId] = useState(notificationItems[0]?.id ?? "");
  const [items, setItems] = useState(notificationItems);

  const filteredItems = items.filter((item) =>
    activeFilter === "all" ? true : item.category === activeFilter,
  );

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0] ?? null;

  const counts = useMemo(
    () => ({
      unread: items.filter((item) => !item.isRead).length,
      appointments: items.filter(
        (item) => item.category === "appointments" && !item.isRead,
      ).length,
      consultations: items.filter(
        (item) => item.category === "consultations" && !item.isRead,
      ).length,
      membership: items.filter(
        (item) => item.category === "membership" && !item.isRead,
      ).length,
    }),
    [items],
  );

  const markRead = (notificationId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  };

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <Layout>
      <Header>
        <Navbar
          logo={
            <div>
              <div className="text-xl font-bold text-gray-900">GoodHealth</div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Notifications
              </div>
            </div>
          }
        >
          <NavGroup>
            <NavLink href="/patient/appointments">Appointments</NavLink>
            <NavLink href="/patient/consultations">Consultations</NavLink>
            <NavLink href="/patient/doctors">Doctors</NavLink>
            <NavLink href="/patient/membership">Membership</NavLink>
          </NavGroup>
        </Navbar>
      </Header>

      <Main className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.08),_transparent_24%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <PageContainer maxWidth="2xl" padding="lg" className="space-y-10">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="space-y-4">
                <Badge variant="info" outlined className="w-fit">
                  Owner-only inbox
                </Badge>
                <div className="space-y-3">
                  <H1>Keep track of appointments, consultations, and updates.</H1>
                  <Body size="lg" muted className="max-w-2xl">
                    Notification visibility is restricted to your account only.
                    Use this center to review reminders, confirmations, and
                    care-related updates in one place.
                  </Body>
                </div>
              </div>

              <Card className="border-sky-100 bg-sky-50/70">
                <CardBody className="space-y-4">
                  <H3>At a glance</H3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <StatCard label="Unread" value={counts.unread} />
                    <StatCard label="Appointments" value={counts.appointments} />
                    <StatCard label="Consultations" value={counts.consultations} />
                    <StatCard label="Membership" value={counts.membership} />
                  </div>
                </CardBody>
              </Card>
            </div>
          </section>

          <Alert variant="info">
            <AlertTitle>Notification rules</AlertTitle>
            <AlertDescription>
              Appointments, consultation reminders, and membership updates are
              generated automatically when your care status changes.
            </AlertDescription>
          </Alert>

          <Grid columns={4} gap="md">
            <MetricCard label="Total notifications" value={items.length} />
            <MetricCard label="Unread" value={counts.unread} />
            <MetricCard label="High priority" value={items.filter((item) => item.priority === "high").length} />
            <MetricCard label="Read today" value={items.filter((item) => item.isRead).length} />
          </Grid>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = activeFilter === category;
              const label =
                category === "all"
                  ? "All"
                  : category.charAt(0).toUpperCase() + category.slice(1);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveFilter(category);
                    const nextSelected = items.find((item) =>
                      category === "all" ? true : item.category === category,
                    );
                    if (nextSelected) setSelectedId(nextSelected.id);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition",
                    active
                      ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <H2>Inbox</H2>
                  <Body muted>Newest updates appear first.</Body>
                </div>
                <Button type="button" variant="outline" onClick={markAllRead}>
                  Mark all read
                </Button>
              </div>

              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const selected = selectedItem?.id === item.id;
                    return (
                      <Card
                        key={item.id}
                        hoverable
                        className={cn(
                          "cursor-pointer border-slate-200 bg-white transition-all",
                          selected && "border-sky-500 ring-2 ring-sky-500/15",
                          !item.isRead && "bg-sky-50/40",
                        )}
                        onClick={() => {
                          setSelectedId(item.id);
                          markRead(item.id);
                        }}
                      >
                        <CardBody className="space-y-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <CardTitle size="lg">{item.title}</CardTitle>
                                {!item.isRead && (
                                  <Badge variant="primary" size="sm">
                                    New
                                  </Badge>
                                )}
                                <Badge variant={priorityVariant(item.priority)}>
                                  {item.priority} priority
                                </Badge>
                              </div>
                              <Body size="sm" muted>
                                {item.message}
                              </Body>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:justify-end">
                              <Badge variant="default" outlined>
                                {categoryLabel(item.category)}
                              </Badge>
                              <Badge variant="info" outlined>
                                {formatDate(item.createdAt, "short")}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {item.relatedName && (
                              <Badge variant="secondary" outlined>
                                {item.relatedName}
                              </Badge>
                            )}
                            <Badge variant="default" outlined>
                              {item.type}
                            </Badge>
                          </div>
                        </CardBody>

                        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
                          <Text muted>{formatDate(item.createdAt, "full")}</Text>
                          <Button asChild size="sm" variant="outline">
                            <Link href={item.href}>{item.actionLabel}</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <EmptyState
                    title="No notifications in this filter"
                    description="Switch to a different category or return to the full inbox."
                    action={
                      <Button type="button" variant="outline" onClick={() => setActiveFilter("all")}>
                        Show all
                      </Button>
                    }
                  />
                )}
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle size="lg">Notification details</CardTitle>
                </CardHeader>
                <CardBody>
                  {selectedItem ? (
                    <Stack spacing="lg">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={priorityVariant(selectedItem.priority)}>
                            {selectedItem.priority} priority
                          </Badge>
                          <Badge variant={categoryBadgeVariant(selectedItem.category)} outlined>
                            {categoryLabel(selectedItem.category)}
                          </Badge>
                          <Badge variant={selectedItem.isRead ? "default" : "primary"} outlined>
                            {selectedItem.isRead ? "Read" : "Unread"}
                          </Badge>
                        </div>

                        <H3>{selectedItem.title}</H3>
                        <Body muted>{selectedItem.message}</Body>
                      </div>

                      <div className="grid gap-3">
                        <SummaryItem label="Type" value={selectedItem.type} />
                        <SummaryItem label="Created" value={formatDate(selectedItem.createdAt, "full")} />
                        <SummaryItem label="Category" value={categoryLabel(selectedItem.category)} />
                        <SummaryItem label="Owner" value="Your account only" />
                      </div>

                      <Alert variant="warning">
                        <AlertTitle>Ownership</AlertTitle>
                        <AlertDescription>
                          You can only view and update notifications that belong
                          to your account.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => markRead(selectedItem.id)}
                        >
                          Mark read
                        </Button>
                        <Button asChild>
                          <Link href={selectedItem.href}>{selectedItem.actionLabel}</Link>
                        </Button>
                      </div>
                    </Stack>
                  ) : (
                    <EmptyState
                      title="No notification selected"
                      description="Choose an item from the inbox to inspect it here."
                    />
                  )}
                </CardBody>
              </Card>

              <Card className="border-slate-200 bg-gradient-to-br from-sky-50 to-emerald-50">
                <CardBody className="space-y-3">
                  <Badge variant="success" outlined>
                    Quick links
                  </Badge>
                  <H3>Go to the next step</H3>
                  <Body size="sm" muted>
                    Open appointments, consultations, or membership screens from
                    a relevant notification.
                  </Body>
                  <div className="grid gap-2">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/patient/appointments">Appointments</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/patient/consultations">Consultations</Link>
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
            <p>GoodHealth notifications</p>
            <p>Only your own care updates are visible here.</p>
          </div>
        </Container>
      </Footer>
    </Layout>
  );
}

function categoryLabel(category: NotificationCategory) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function priorityVariant(priority: "high" | "medium" | "low") {
  if (priority === "high") return "error";
  if (priority === "medium") return "warning";
  return "secondary";
}

function categoryBadgeVariant(category: NotificationCategory) {
  if (category === "appointments") return "primary";
  if (category === "consultations") return "success";
  if (category === "membership") return "info";
  return "default";
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

export default NotificationsPage;

