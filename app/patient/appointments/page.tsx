"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  Grid,
  H1,
  H3,
  Stack,
  Text,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  reviews: number;
  consultationFee: number;
  acceptsVirtual: boolean;
  inNetwork: boolean;
  nextAvailable: string;
  bio: string;
};

const doctors: Doctor[] = [
  {
    id: "dr-amara-bello",
    name: "Dr. Amara Bello",
    specialty: "Cardiology",
    hospital: "Riverside Heart Center",
    location: "Berlin Mitte",
    rating: 4.9,
    reviews: 184,
    consultationFee: 180,
    acceptsVirtual: true,
    inNetwork: true,
    nextAvailable: "Today, 4:30 PM",
    bio: "Focused on hypertension, arrhythmia follow-up, and prevention plans.",
  },
  {
    id: "dr-noah-stein",
    name: "Dr. Noah Stein",
    specialty: "Orthopedics",
    hospital: "Northside Sports Clinic",
    location: "Kreuzberg",
    rating: 4.8,
    reviews: 132,
    consultationFee: 160,
    acceptsVirtual: false,
    inNetwork: true,
    nextAvailable: "Tomorrow, 9:00 AM",
    bio: "Helps active patients recover from injuries and build rehab plans.",
  },
  {
    id: "dr-lina-park",
    name: "Dr. Lina Park",
    specialty: "Dermatology",
    hospital: "Skin & Wellness Studio",
    location: "Charlottenburg",
    rating: 4.9,
    reviews: 216,
    consultationFee: 140,
    acceptsVirtual: true,
    inNetwork: false,
    nextAvailable: "Thursday, 11:15 AM",
    bio: "Known for quick follow-ups, acne management, and skin screening.",
  },
  {
    id: "dr-ibrahim-adele",
    name: "Dr. Ibrahim Adele",
    specialty: "Family Medicine",
    hospital: "GoodHealth Primary Care",
    location: "Prenzlauer Berg",
    rating: 4.7,
    reviews: 98,
    consultationFee: 110,
    acceptsVirtual: true,
    inNetwork: true,
    nextAvailable: "Today, 6:10 PM",
    bio: "A steady first stop for families who want continuity and quick access.",
  },
];

const appointmentTypes = [
  {
    id: "video",
    label: "Video consultation",
    description: "Best for follow-ups, quick advice, and routine care.",
    duration: "25 min",
  },
  {
    id: "in-person",
    label: "In-person visit",
    description: "Best for physical exams, procedures, or new symptoms.",
    duration: "35 min",
  },
  {
    id: "follow-up",
    label: "Follow-up",
    description: "Best for reviewing results or checking progress.",
    duration: "15 min",
  },
] as const;

const dateOptions = [
  { id: "today", label: "Today", value: "Today, June 24", accent: "Soonest" },
  { id: "tomorrow", label: "Tomorrow", value: "Wed, June 25", accent: "Fast" },
  { id: "fri", label: "Friday", value: "Fri, June 27", accent: "Flexible" },
  { id: "sat", label: "Saturday", value: "Sat, June 28", accent: "Weekend" },
] as const;

const timeSlots = [
  "8:30 AM",
  "9:15 AM",
  "10:45 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
  "6:15 PM",
] as const;

function AppointmentBookingPage() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctor");
  const doctor =
    doctors.find((entry) => entry.id === doctorId) ?? doctors[0] ?? null;
  const defaultType = searchParams.get("type");

  const [appointmentType, setAppointmentType] = useState<
    (typeof appointmentTypes)[number]["id"]
  >(defaultType === "video" || defaultType === "in-person" || defaultType === "follow-up" ? defaultType : "video");
  const [selectedDate, setSelectedDate] = useState<
    (typeof dateOptions)[number]["id"]
  >(dateOptions[0].id);
  const [selectedTime, setSelectedTime] = useState<(typeof timeSlots)[number]>(
    timeSlots[3],
  );
  const [reason, setReason] = useState("Chest pressure and occasional palpitations.");
  const [notes, setNotes] = useState(
    "Please review recent blood pressure readings and medication changes.",
  );
  const [contactMethod, setContactMethod] = useState<"sms" | "email" | "phone">(
    "sms",
  );
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const selectedType = appointmentTypes.find(
    (entry) => entry.id === appointmentType,
  ) ?? appointmentTypes[0];
  const selectedDateLabel =
    dateOptions.find((entry) => entry.id === selectedDate)?.value ??
    dateOptions[0].value;

  const bookingSummary = useMemo(
    () => ({
      date: selectedDateLabel,
      time: selectedTime,
      type: selectedType.id as "video" | "in-person" | "follow-up",
      location:
        selectedType.id === "video"
          ? "Secure video room"
          : doctor?.location ?? "GoodHealth Clinic",
    }),
    [doctor?.location, selectedDateLabel, selectedTime, selectedType.id],
  );

  return (
    <Layout>
      <Header>
        <Navbar
          logo={
            <div>
              <div className="text-xl font-bold text-gray-900">GoodHealth</div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Appointment Booking
              </div>
            </div>
          }
        >
          <NavGroup>
            <NavLink href="/patient/doctors">Doctors</NavLink>
            <NavLink href="/patient/appointments">Book</NavLink>
            <NavLink href="/patient/consultations">Consultations</NavLink>
            <NavLink href="/patient/notifications">Notifications</NavLink>
            <NavLink href="/patient/membership">Membership</NavLink>
          </NavGroup>
        </Navbar>
      </Header>

      <Main className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_28%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <PageContainer maxWidth="2xl" padding="lg" className="space-y-10">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="space-y-5">
                <Badge variant="primary" outlined className="w-fit">
                  Book your next visit
                </Badge>
                <div className="space-y-3">
                  <H1>Schedule care in a few focused steps.</H1>
                  <Body size="lg" muted className="max-w-2xl">
                    Pick a doctor, choose the type of appointment, and lock in a
                    time that fits your day. We&apos;ll keep the details clear
                    before you confirm.
                  </Body>
                </div>
                <Grid columns={3} gap="sm">
                  <QuickStat label="Average booking time" value="2 min" />
                  <QuickStat label="Fastest slots" value="Today" />
                  <QuickStat label="Confirmation" value="Instant" />
                </Grid>
              </div>

              <Card className="border-sky-100 bg-sky-50/70">
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Text muted className="uppercase tracking-[0.2em]">
                        Booking preview
                      </Text>
                      <H3 className="mt-2">What you are about to schedule</H3>
                    </div>
                    <Badge variant={doctor?.inNetwork ? "success" : "warning"}>
                      {doctor?.inNetwork ? "In network" : "Self pay"}
                    </Badge>
                  </div>
                  {doctor ? (
                    <Stack spacing="sm">
                      <div>
                        <div className="text-lg font-semibold text-slate-950">
                          {doctor.name}
                        </div>
                        <Body size="sm" muted>
                          {doctor.specialty} at {doctor.hospital}
                        </Body>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <MiniStat label="Fee" value={`$${doctor.consultationFee}`} />
                        <MiniStat label="Rating" value={`${doctor.rating} / 5`} />
                      </div>
                      <Alert variant="info">
                        <AlertTitle>Next available</AlertTitle>
                        <AlertDescription>{doctor.nextAvailable}</AlertDescription>
                      </Alert>
                    </Stack>
                  ) : (
                    <Body muted>No doctor selected yet. Start from the directory.</Body>
                  )}
                </CardBody>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/patient/doctors">Browse doctors first</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Choose appointment type</CardTitle>
                  <Body size="sm" muted>
                    Match the visit type to the care you need today.
                  </Body>
                </CardHeader>
                <CardBody className="grid gap-4 md:grid-cols-3">
                  {appointmentTypes.map((entry) => {
                    const active = appointmentType === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setAppointmentType(entry.id)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition",
                          active
                            ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-semibold text-slate-950">
                            {entry.label}
                          </div>
                          <Badge variant="default" outlined size="sm">
                            {entry.duration}
                          </Badge>
                        </div>
                        <Body size="sm" muted className="mt-2">
                          {entry.description}
                        </Body>
                      </button>
                    );
                  })}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Pick a date and time</CardTitle>
                  <Body size="sm" muted>
                    Choose from the first available openings we can hold for you.
                  </Body>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-4">
                    {dateOptions.map((entry) => {
                      const active = selectedDate === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setSelectedDate(entry.id)}
                          className={cn(
                            "rounded-2xl border p-4 text-left transition",
                            active
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-200 bg-white hover:border-slate-300",
                          )}
                        >
                          <div className="text-xs uppercase tracking-[0.2em] opacity-70">
                            {entry.accent}
                          </div>
                          <div className="mt-2 text-base font-semibold">
                            {entry.label}
                          </div>
                          <div className={cn("mt-1 text-sm", active && "text-white/75")}>
                            {entry.value}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <div className="mb-3 text-sm font-semibold text-slate-900">
                      Available time slots
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {timeSlots.map((slot) => {
                        const active = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              "rounded-xl border px-4 py-3 text-sm font-medium transition",
                              active
                                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                            )}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Tell us what you need</CardTitle>
                  <Body size="sm" muted>
                    A short description helps the doctor prepare for the visit.
                  </Body>
                </CardHeader>
                <CardBody className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-900">
                      Reason for visit
                    </span>
                    <textarea
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-900">
                      Extra notes
                    </span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["sms", "Text me"],
                      ["email", "Email me"],
                      ["phone", "Call me"],
                    ].map(([value, label]) => {
                      const active = contactMethod === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setContactMethod(value as "sms" | "email" | "phone")
                          }
                          className={cn(
                            "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                            active
                              ? "border-sky-500 bg-sky-50 text-sky-900"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What happens next</CardTitle>
                </CardHeader>
                <CardBody className="grid gap-4 md:grid-cols-3">
                  <StepCard
                    step="1"
                    title="Review"
                    description="Check the summary on the right before confirming the slot."
                  />
                  <StepCard
                    step="2"
                    title="Confirm"
                    description="We reserve the appointment and prepare the visit details."
                  />
                  <StepCard
                    step="3"
                    title="Follow up"
                    description="You&apos;ll get reminders and can reschedule from your account."
                  />
                </CardBody>
              </Card>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle size="lg">Booking summary</CardTitle>
                      <Body size="sm" muted className="mt-1">
                        Double-check the details before you confirm.
                      </Body>
                    </div>
                    <Badge variant={bookingConfirmed ? "success" : "warning"}>
                      {bookingConfirmed ? "Confirmed" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody className="space-y-5">
                  {doctor ? (
                    <AppointmentInfo
                      doctorName={doctor.name}
                      specialty={doctor.specialty}
                      date={bookingSummary.date}
                      time={bookingSummary.time}
                      type={
                        bookingSummary.type === "video"
                          ? "video"
                          : bookingSummary.type === "follow-up"
                            ? "consultation"
                            : "in-person"
                      }
                      status={bookingConfirmed ? "confirmed" : "pending"}
                      location={bookingSummary.location}
                      notes={reason}
                    />
                  ) : (
                    <Alert variant="warning">
                      <AlertTitle>No doctor selected</AlertTitle>
                      <AlertDescription>
                        Return to the doctor directory and choose a profile to
                        continue.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <MiniStat label="Estimate" value={`$${doctor?.consultationFee ?? 0}`} />
                    <MiniStat
                      label="Method"
                      value={contactMethod.toUpperCase()}
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Visit notes
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{notes}</p>
                  </div>

                  <Alert variant="info">
                    <AlertTitle>Reminder</AlertTitle>
                    <AlertDescription>
                      Please arrive 10 minutes early for in-person visits and
                      keep a list of medications or recent readings nearby.
                    </AlertDescription>
                  </Alert>
                </CardBody>
                <CardFooter className="grid gap-3">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setBookingConfirmed(true)}
                  >
                    Confirm appointment
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/patient/doctors">Change doctor</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-slate-200 bg-gradient-to-br from-sky-50 to-emerald-50">
                <CardBody className="space-y-3">
                  <Badge variant="success" outlined>
                    Need coverage help?
                  </Badge>
                  <H3>Review membership options</H3>
                  <Body size="sm" muted>
                    If this doctor is out of network, you can compare plans
                    before finalizing future visits.
                  </Body>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/patient/membership">Browse membership</Link>
                  </Button>
                </CardBody>
              </Card>
            </aside>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardBody>
                <Body size="sm" muted>
                  Selected doctor
                </Body>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {doctor?.name ?? "Choose a doctor"}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Body size="sm" muted>
                  Appointment date
                </Body>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {bookingSummary.date}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Body size="sm" muted>
                  Appointment time
                </Body>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {bookingSummary.time}
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Body size="sm" muted>
                  Booking status
                </Body>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {bookingConfirmed ? "Confirmed" : "Ready to confirm"}
                </div>
              </CardBody>
            </Card>
          </section>
        </PageContainer>
      </Main>

      <Footer>
        <Container className="py-8">
          <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>GoodHealth appointment booking</p>
            <p>{formatDate(new Date(), "full")}</p>
          </div>
        </Container>
      </Footer>
    </Layout>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
        {step}
      </div>
      <div className="mt-3 text-base font-semibold text-slate-950">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{description}</div>
    </div>
  );
}

export default AppointmentBookingPage;
