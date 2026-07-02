"use client";

import { useEffect, useMemo, useState } from "react";
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
  Metric,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAvailableDoctors, type AvailableDoctor } from "../appointments/actions";

const availabilityFilters = ["Any time", "Virtual available"] as const;
const networkFilters = ["Any network", "Virtual", "In-person only"] as const;
const sortOptions = [
  "Recommended",
  "Lowest fee",
  "Most experienced",
] as const;

function matchesSearch(doctor: AvailableDoctor, query: string) {
  if (!query) return true;
  const haystack = [
    doctor.name,
    doctor.specialty ?? "",
    doctor.hospitalName ?? "",
    doctor.location ?? "",
    doctor.bio ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function DoctorDiscoveryPage() {
  const [doctors, setDoctors] = useState<AvailableDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [availability, setAvailability] =
    useState<(typeof availabilityFilters)[number]>("Any time");
  const [network, setNetwork] =
    useState<(typeof networkFilters)[number]>("Any network");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Recommended");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAvailableDoctors();
        if (!cancelled) {
          setDoctors(data);
          setSelectedDoctorId(data[0]?.id ?? "");
        }
      } catch (error) {
        console.error("Failed to load doctors:", error);
        if (!cancelled) setLoadError("Failed to load doctors.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const specialties = useMemo(() => {
    const set = new Set<string>();
    doctors.forEach((d) => {
      if (d.specialty) set.add(d.specialty);
    });
    return ["All specialties", ...Array.from(set).sort()];
  }, [doctors]);

  const [specialty, setSpecialty] = useState<string>("All specialties");
  // Keep specialty selection valid as the list loads.
  useEffect(() => {
    if (specialty !== "All specialties" && !specialties.includes(specialty)) {
      setSpecialty("All specialties");
    }
  }, [specialties, specialty]);

  const filteredDoctors = doctors
    .filter((doctor) => matchesSearch(doctor, query))
    .filter((doctor) =>
      specialty === "All specialties" ? true : doctor.specialty === specialty,
    )
    .filter((doctor) => {
      if (availability === "Any time") return true;
      return doctor.supportsVirtualConsultation;
    })
    .filter((doctor) => {
      if (network === "Any network") return true;
      if (network === "Virtual") return doctor.supportsVirtualConsultation;
      return !doctor.supportsVirtualConsultation;
    })
    .sort((a, b) => {
      if (sort === "Lowest fee") return a.consultationFee - b.consultationFee;
      if (sort === "Most experienced") {
        return (b.yearsOfExperience ?? 0) - (a.yearsOfExperience ?? 0);
      }
      // Recommended: verified doctors by experience, then fee.
      return (
        (b.yearsOfExperience ?? 0) - (a.yearsOfExperience ?? 0) ||
        a.consultationFee - b.consultationFee
      );
    });

  const selectedDoctor =
    filteredDoctors.find((doctor) => doctor.id === selectedDoctorId) ??
    filteredDoctors[0] ??
    null;

  return (
    <Layout>
      <Header>
        <Navbar
          logo={
            <div>
              <div className="text-xl font-bold text-gray-900">GoodHealth</div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Doctor Discovery
              </div>
            </div>
          }
        >
          <NavGroup>
            <NavLink href="/patient/membership">Membership</NavLink>
            <NavLink href="/patient/doctors">Doctors</NavLink>
            <NavLink href="/patient/consultations">Consultations</NavLink>
            <NavLink href="/patient/notifications">Notifications</NavLink>
          </NavGroup>
        </Navbar>
      </Header>

      <Main className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.10),_transparent_26%),linear-gradient(to_bottom,_#f8fafc,_#ffffff)]">
        <PageContainer maxWidth="2xl" padding="lg" className="space-y-10">
          <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-950/10 sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.28),transparent_35%,transparent_65%,rgba(34,197,94,0.20))]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-6">
                <Badge variant="info" outlined className="w-fit bg-white/10 text-cyan-50 border-white/20">
                  Verified care network
                </Badge>
                <div className="max-w-2xl space-y-4">
                  <H1 className="text-white">
                    Discover the right doctor for the kind of care you need.
                  </H1>
                  <Body size="lg" className="max-w-2xl text-slate-200">
                    Search by specialty, availability, or location, then compare
                    the verified doctors who can help you next.
                  </Body>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <HeroStat label="Verified doctors" value={loading ? "—" : doctors.length} />
                  <HeroStat
                    label="Virtual care"
                    value={
                      loading
                        ? "—"
                        : doctors.filter((d) => d.supportsVirtualConsultation).length
                    }
                  />
                  <HeroStat label="Specialties" value={loading ? "—" : specialties.length - 1} />
                </div>
              </div>

              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur-md">
                <CardHeader className="border-white/10">
                  <CardTitle className="text-white">Find care faster</CardTitle>
                  <Body size="sm" className="text-slate-200">
                    Use filters to narrow the network before booking a consult.
                  </Body>
                </CardHeader>
                <CardBody className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      Search doctors
                    </span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Cardiology, hospital name, city…"
                      className="h-12 w-full rounded-xl border border-white/15 bg-slate-900/60 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <select
                      value={availability}
                      onChange={(event) =>
                        setAvailability(
                          event.target.value as typeof availability,
                        )
                      }
                      className="h-11 rounded-xl border border-white/15 bg-slate-900/60 px-3 text-sm text-white outline-none transition focus:border-cyan-300"
                    >
                      {availabilityFilters.map((value) => (
                        <option key={value} value={value} className="text-slate-950">
                          {value}
                        </option>
                      ))}
                    </select>
                    <select
                      value={network}
                      onChange={(event) =>
                        setNetwork(event.target.value as typeof network)
                      }
                      className="h-11 rounded-xl border border-white/15 bg-slate-900/60 px-3 text-sm text-white outline-none transition focus:border-cyan-300"
                    >
                      {networkFilters.map((value) => (
                        <option key={value} value={value} className="text-slate-950">
                          {value}
                        </option>
                      ))}
                    </select>
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value as typeof sort)}
                      className="h-11 rounded-xl border border-white/15 bg-slate-900/60 px-3 text-sm text-white outline-none transition focus:border-cyan-300"
                    >
                      {sortOptions.map((value) => (
                        <option key={value} value={value} className="text-slate-950">
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardBody>
              </Card>
            </div>
          </section>

          {loadError && (
            <Alert variant="error">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{loadError}</AlertDescription>
            </Alert>
          )}

          {specialties.length > 1 && (
            <section className="space-y-4">
              <H2>Browse by specialty</H2>
              <div className="flex flex-wrap gap-2">
                {specialties.map((value) => {
                  const active = specialty === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSpecialty(value)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition",
                        active
                          ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <Grid columns={4} gap="md">
            <Metric label="Matched doctors" value={loading ? "—" : filteredDoctors.length} />
            <Metric
              label="Virtual available"
              value={
                loading
                  ? "—"
                  : filteredDoctors.filter((d) => d.supportsVirtualConsultation).length
              }
            />
            <Metric
              label="In person"
              value={
                loading
                  ? "—"
                  : filteredDoctors.filter((d) => !d.supportsVirtualConsultation).length
              }
            />
            <Metric label="Specialty" value={specialty === "All specialties" ? "All" : specialty} />
          </Grid>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <H2>Available doctors</H2>
                  <Body muted>
                    Compare bios and consultation style before choosing a profile.
                  </Body>
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <Card>
                    <CardBody>
                      <Body muted>Loading verified doctors…</Body>
                    </CardBody>
                  </Card>
                ) : filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => {
                    const active = selectedDoctor?.id === doctor.id;
                    return (
                      <Card
                        key={doctor.id}
                        hoverable
                        className={cn(
                          "cursor-pointer border-slate-200/80 bg-white transition-all",
                          active && "border-sky-500 ring-2 ring-sky-500/15",
                        )}
                        onClick={() => setSelectedDoctorId(doctor.id)}
                      >
                        <CardBody className="space-y-5">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex gap-4">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-lg font-bold text-white shadow-sm">
                                {doctor.name
                                  .replace("Dr. ", "")
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")}
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <CardTitle size="lg">{doctor.name}</CardTitle>
                                  <Badge variant="success" size="sm">
                                    Verified
                                  </Badge>
                                </div>
                                <Body size="sm" muted>
                                  {doctor.specialty ?? "General"}
                                  {doctor.hospitalName ? ` at ${doctor.hospitalName}` : ""}
                                </Body>
                                {doctor.location && <Text muted>{doctor.location}</Text>}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:justify-end">
                              <Badge variant={doctor.supportsVirtualConsultation ? "success" : "warning"}>
                                {doctor.supportsVirtualConsultation ? "Virtual ready" : "In-person"}
                              </Badge>
                            </div>
                          </div>

                          {doctor.bio && (
                            <Body size="sm" muted>
                              {doctor.bio}
                            </Body>
                          )}

                          <div className="grid gap-3 sm:grid-cols-3">
                            <InfoBlock
                              label="Experience"
                              value={
                                doctor.yearsOfExperience
                                  ? `${doctor.yearsOfExperience} years`
                                  : "—"
                              }
                            />
                            <InfoBlock
                              label="Fee"
                              value={`₦${doctor.consultationFee}`}
                            />
                            <InfoBlock label="Location" value={doctor.location ?? "—"} />
                          </div>
                        </CardBody>

                        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedDoctorId(doctor.id);
                            }}
                          >
                            Review profile
                          </Button>
                          <Button asChild size="sm">
                            <Link
                              href={`/patient/appointments?doctor=${doctor.id}&type=${doctor.supportsVirtualConsultation ? "video" : "in-person"}`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              Book visit
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })
                ) : (
                  <EmptyState
                    title="No doctors match these filters"
                    description="Try a different specialty, broaden the network filter, or clear the search term."
                    action={
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setQuery("");
                          setSpecialty("All specialties");
                          setAvailability("Any time");
                          setNetwork("Any network");
                          setSort("Recommended");
                        }}
                      >
                        Reset filters
                      </Button>
                    }
                  />
                )}
              </div>
            </section>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle size="lg">Selected doctor</CardTitle>
                </CardHeader>
                <CardBody>
                  {selectedDoctor ? (
                    <Stack spacing="lg">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-sky-700 text-lg font-bold text-white">
                          {selectedDoctor.name
                            .replace("Dr. ", "")
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div className="space-y-1">
                          <H3>{selectedDoctor.name}</H3>
                          <Body size="sm" muted>
                            {selectedDoctor.specialty ?? "General"}
                          </Body>
                          {selectedDoctor.hospitalName && (
                            <Text muted>{selectedDoctor.hospitalName}</Text>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <InfoBlock label="Location" value={selectedDoctor.location ?? "—"} />
                        <InfoBlock
                          label="Consult fee"
                          value={`₦${selectedDoctor.consultationFee}`}
                        />
                        <InfoBlock
                          label="Experience"
                          value={
                            selectedDoctor.yearsOfExperience
                              ? `${selectedDoctor.yearsOfExperience} years`
                              : "—"
                          }
                        />
                      </div>

                      {selectedDoctor.bio && (
                        <Body size="sm" muted>
                          {selectedDoctor.bio}
                        </Body>
                      )}

                      <Button asChild className="w-full">
                        <Link
                          href={`/patient/appointments?doctor=${selectedDoctor.id}&type=${selectedDoctor.supportsVirtualConsultation ? "video" : "in-person"}`}
                        >
                          Book this doctor
                        </Link>
                      </Button>
                    </Stack>
                  ) : (
                    <EmptyState
                      title="No doctor selected"
                      description="Pick a profile from the results list to inspect it here."
                    />
                  )}
                </CardBody>
              </Card>
            </aside>
          </div>
        </PageContainer>
      </Main>

      <Footer>
        <Container className="py-8">
          <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <p>GoodHealth doctor discovery</p>
            <p>Search, compare, and choose the right care path.</p>
          </div>
        </Container>
      </Footer>
    </Layout>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900">{value}</div>
    </div>
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

export default DoctorDiscoveryPage;
