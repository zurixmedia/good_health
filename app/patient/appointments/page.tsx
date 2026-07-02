"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
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
  EmptyState,
  Grid,
  H1,
  H3,
  Stack,
  Text,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getDoctorById,
  getAvailableTimeSlots,
  createAppointment,
  type DoctorDetail,
  type TimeSlot,
  type CreateAppointmentResult,
} from "./actions";

const SLOT_LENGTH_MINUTES = 30;

const appointmentTypes = [
  {
    id: "video",
    label: "Video consultation",
    description: "Best for follow-ups, quick advice, and routine care.",
    duration: "30 min",
  },
  {
    id: "in-person",
    label: "In-person visit",
    description: "Best for physical exams, procedures, or new symptoms.",
    duration: "30 min",
  },
] as const;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Builds the next `count` bookable days starting today. */
function buildDateOptions(count = 5) {
  const base = startOfToday();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(base);
    date.setDate(base.getDate() + i);
    return {
      id: date.toISOString().slice(0, 10), // yyyy-mm-dd
      date,
      relative: i === 0 ? "Today" : i === 1 ? "Tomorrow" : "Soon",
      label: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date),
    };
  });
}

const dateOptions = buildDateOptions(5);

function AppointmentBookingPage() {
  const searchParams = useSearchParams();
  const doctorIdFromUrl = searchParams.get("doctor");
  const typeFromUrl = searchParams.get("type");

  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [doctorLoading, setDoctorLoading] = useState(true);

  const [appointmentType, setAppointmentType] =
    useState<(typeof appointmentTypes)[number]["id"]>(
      typeFromUrl === "video" || typeFromUrl === "in-person"
        ? typeFromUrl
        : "video",
    );
  const [selectedDateId, setSelectedDateId] = useState(dateOptions[0].id);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<CreateAppointmentResult | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load the doctor selected via ?doctor=<id>.
  useEffect(() => {
    let cancelled = false;
    setDoctorLoading(true);
    (async () => {
      if (!doctorIdFromUrl) {
        setDoctor(null);
        setDoctorLoading(false);
        return;
      }
      const data = await getDoctorById(doctorIdFromUrl);
      if (!cancelled) {
        setDoctor(data);
        setDoctorLoading(false);
        // If the doctor doesn't support virtual visits, force in-person.
        if (data && !data.supportsVirtualConsultation) {
          setAppointmentType("in-person");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doctorIdFromUrl]);

  const selectedDate = useMemo(
    () => dateOptions.find((d) => d.id === selectedDateId) ?? dateOptions[0],
    [selectedDateId],
  );

  // Load time slots whenever the doctor or date changes.
  useEffect(() => {
    if (!doctor) {
      setSlots([]);
      setSelectedSlotIso(null);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    setSelectedSlotIso(null);
    (async () => {
      const data = await getAvailableTimeSlots(doctor.id, selectedDate.date);
      if (!cancelled) {
        setSlots(data);
        setSlotsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [doctor, selectedDate]);

  const canBook =
    !!doctor &&
    !!selectedSlotIso &&
    reason.trim().length >= 3 &&
    !isPending;

  const handleConfirm = () => {
    if (!doctor || !selectedSlotIso) return;
    setResult(null);
    startTransition(async () => {
      const res = await createAppointment({
        doctorId: doctor.id,
        date: selectedDateId,
        slotIso: selectedSlotIso,
        type: appointmentType,
        reason: reason.trim(),
        notes: notes.trim(),
      });
      setResult(res);
    });
  };

  const success = result?.ok === true;

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
          {/* ---------------- Success state ---------------- */}
          {success && result.appointment ? (
            <Card>
              <CardBody className="space-y-6">
                <Badge variant="success">Appointment booked</Badge>
                <H1>Your appointment is confirmed</H1>
                <AppointmentInfo
                  doctorName={result.appointment.doctorName}
                  date={new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(result.appointment.appointmentDate))}
                  time={new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(result.appointment.appointmentStartTime))}
                  type={
                    result.appointment.appointmentType === "VIRTUAL"
                      ? "video"
                      : "in-person"
                  }
                  status="pending"
                  location={
                    result.appointment.appointmentType === "VIRTUAL"
                      ? "Secure video room"
                      : doctor?.hospitalName ?? "Clinic"
                  }
                  notes={reason}
                />
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/patient/dashboard">Go to dashboard</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResult(null);
                      setSelectedSlotIso(null);
                    }}
                  >
                    Book another
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <>
              {/* ---------------- Hero ---------------- */}
              <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                  <div className="space-y-5">
                    <Badge variant="primary" outlined className="w-fit">
                      Book your next visit
                    </Badge>
                    <div className="space-y-3">
                      <H1>Schedule care in a few focused steps.</H1>
                      <Body size="lg" muted className="max-w-2xl">
                        Pick a doctor, choose the type of appointment, and lock in
                        a time that fits your day. We&apos;ll keep the details
                        clear before you confirm.
                      </Body>
                    </div>
                  </div>

                  <Card className="border-sky-100 bg-sky-50/70">
                    <CardBody className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Text muted className="uppercase tracking-[0.2em]">
                            Booking preview
                          </Text>
                          <H3 className="mt-2">Selected doctor</H3>
                        </div>
                        <Badge
                          variant={doctor?.supportsVirtualConsultation ? "success" : "warning"}
                        >
                          {doctor?.supportsVirtualConsultation
                            ? "Virtual ready"
                            : "In-person"}
                        </Badge>
                      </div>
                      {doctorLoading ? (
                        <Body muted>Loading doctor…</Body>
                      ) : doctor ? (
                        <Stack spacing="sm">
                          <div>
                            <div className="text-lg font-semibold text-slate-950">
                              {doctor.name}
                            </div>
                            <Body size="sm" muted>
                              {doctor.specialty ?? "General"}
                              {doctor.hospitalName ? ` at ${doctor.hospitalName}` : ""}
                            </Body>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <MiniStat label="Fee" value={`₦${doctor.consultationFee}`} />
                            <MiniStat
                              label="Experience"
                              value={
                                doctor.yearsOfExperience
                                  ? `${doctor.yearsOfExperience} yrs`
                                  : "—"
                              }
                            />
                          </div>
                        </Stack>
                      ) : (
                        <Body muted>
                          No doctor selected. Start from the directory.
                        </Body>
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

              {!doctorIdFromUrl && (
                <Alert variant="warning">
                  <AlertTitle>No doctor selected</AlertTitle>
                  <AlertDescription>
                    Choose a doctor from the directory to begin booking.
                  </AlertDescription>
                </Alert>
              )}

              {result && !result.ok && (
                <Alert variant="error">
                  <AlertTitle>Could not book</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}

              {/* ---------------- Steps ---------------- */}
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
                <section className="space-y-6">
                  {/* Step 1: type */}
                  <Card>
                    <CardHeader>
                      <CardTitle>1. Choose appointment type</CardTitle>
                      <Body size="sm" muted>
                        Match the visit type to the care you need today.
                      </Body>
                    </CardHeader>
                    <CardBody className="grid gap-4 md:grid-cols-2">
                      {appointmentTypes.map((entry) => {
                        const disabled =
                          entry.id === "video" &&
                          !!doctor &&
                          !doctor.supportsVirtualConsultation;
                        const active = appointmentType === entry.id;
                        return (
                          <button
                            key={entry.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => setAppointmentType(entry.id)}
                            className={cn(
                              "rounded-2xl border p-4 text-left transition",
                              active
                                ? "border-sky-500 bg-sky-50 ring-2 ring-sky-500/10"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                              disabled && "cursor-not-allowed opacity-50",
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

                  {/* Step 2: date + time */}
                  <Card>
                    <CardHeader>
                      <CardTitle>2. Pick a date and time</CardTitle>
                      <Body size="sm" muted>
                        Time slots are generated from the doctor&apos;s availability.
                      </Body>
                    </CardHeader>
                    <CardBody className="space-y-6">
                      <div className="grid gap-3 sm:grid-cols-5">
                        {dateOptions.map((entry) => {
                          const active = selectedDateId === entry.id;
                          return (
                            <button
                              key={entry.id}
                              type="button"
                              onClick={() => setSelectedDateId(entry.id)}
                              className={cn(
                                "rounded-2xl border p-4 text-left transition",
                                active
                                  ? "border-slate-950 bg-slate-950 text-white"
                                  : "border-slate-200 bg-white hover:border-slate-300",
                              )}
                            >
                              <div className="text-xs uppercase tracking-[0.2em] opacity-70">
                                {entry.relative}
                              </div>
                              <div className="mt-2 text-base font-semibold">
                                {entry.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div>
                        <div className="mb-3 text-sm font-semibold text-slate-900">
                          Available time slots
                        </div>
                        {slotsLoading ? (
                          <Body muted>Loading slots…</Body>
                        ) : slots.length > 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                            {slots.map((slot) => {
                              const active = selectedSlotIso === slot.iso;
                              return (
                                <button
                                  key={slot.iso}
                                  type="button"
                                  onClick={() => setSelectedSlotIso(slot.iso)}
                                  className={cn(
                                    "rounded-xl border px-4 py-3 text-sm font-medium transition",
                                    active
                                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                                  )}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <Body muted>
                            No open slots on this day. Try another date.
                          </Body>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Step 3: reason */}
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
                          onChange={(e) => setReason(e.target.value)}
                          rows={4}
                          placeholder="Briefly describe your symptoms or reason for booking."
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-900">
                          Extra notes (optional)
                        </span>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
                        />
                      </label>
                    </CardBody>
                  </Card>
                </section>

                {/* ---------------- Summary ---------------- */}
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
                        <Badge variant={selectedSlotIso ? "success" : "warning"}>
                          {selectedSlotIso ? "Ready" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-5">
                      {doctor ? (
                        <AppointmentInfo
                          doctorName={doctor.name}
                          specialty={doctor.specialty ?? "General"}
                          date={selectedDate.label}
                          time={
                            slots.find((s) => s.iso === selectedSlotIso)?.label ??
                            "—"
                          }
                          type={appointmentType === "video" ? "video" : "in-person"}
                          status="pending"
                          location={
                            appointmentType === "video"
                              ? "Secure video room"
                              : doctor.hospitalName ?? "Clinic"
                          }
                          notes={reason || undefined}
                        />
                      ) : (
                        <Body muted>No doctor selected.</Body>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <MiniStat
                          label="Estimate"
                          value={doctor ? `₦${doctor.consultationFee}` : "—"}
                        />
                        <MiniStat
                          label="Duration"
                          value={`${SLOT_LENGTH_MINUTES} min`}
                        />
                      </div>

                      <Alert variant="info">
                        <AlertTitle>Reminder</AlertTitle>
                        <AlertDescription>
                          Please arrive 10 minutes early for in-person visits and
                          keep a list of medications nearby.
                        </AlertDescription>
                      </Alert>
                    </CardBody>
                    <CardFooter className="grid gap-3">
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleConfirm}
                        disabled={!canBook}
                      >
                        {isPending ? "Booking…" : "Confirm appointment"}
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/patient/doctors">Change doctor</Link>
                      </Button>
                    </CardFooter>
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
            <p>GoodHealth appointment booking</p>
            <p>Real-time availability powered by your care network.</p>
          </div>
        </Container>
      </Footer>
    </Layout>
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

export default AppointmentBookingPage;
