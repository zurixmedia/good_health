"use client";

import { useState } from "react";
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

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  reviews: number;
  yearsExperience: number;
  nextAvailable: string;
  responseTime: string;
  consultationFee: number;
  languages: string[];
  tags: string[];
  verified: boolean;
  featured?: boolean;
  inNetwork: boolean;
  acceptsVirtual: boolean;
  availability: "Today" | "This week" | "Next week";
  matchScore: number;
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
    yearsExperience: 14,
    nextAvailable: "Today, 4:30 PM",
    responseTime: "12 min avg",
    consultationFee: 180,
    languages: ["English", "German", "French"],
    tags: ["Heart health", "Preventive care", "Virtual consults"],
    verified: true,
    featured: true,
    inNetwork: true,
    acceptsVirtual: true,
    availability: "Today",
    matchScore: 98,
    bio:
      "Focused on hypertension, arrhythmia follow-up, and patient-friendly preventive care plans.",
  },
  {
    id: "dr-noah-stein",
    name: "Dr. Noah Stein",
    specialty: "Orthopedics",
    hospital: "Northside Sports Clinic",
    location: "Kreuzberg",
    rating: 4.8,
    reviews: 132,
    yearsExperience: 11,
    nextAvailable: "Tomorrow, 9:00 AM",
    responseTime: "18 min avg",
    consultationFee: 160,
    languages: ["English", "German"],
    tags: ["Sports injuries", "Joint pain", "Rehab"],
    verified: true,
    inNetwork: true,
    acceptsVirtual: false,
    availability: "Today",
    matchScore: 95,
    bio:
      "Helps active patients recover from injuries and build practical rehab plans that fit real schedules.",
  },
  {
    id: "dr-lina-park",
    name: "Dr. Lina Park",
    specialty: "Dermatology",
    hospital: "Skin & Wellness Studio",
    location: "Charlottenburg",
    rating: 4.9,
    reviews: 216,
    yearsExperience: 10,
    nextAvailable: "Thursday, 11:15 AM",
    responseTime: "9 min avg",
    consultationFee: 140,
    languages: ["English", "German", "Korean"],
    tags: ["Acne", "Allergy testing", "Virtual consults"],
    verified: true,
    featured: true,
    inNetwork: false,
    acceptsVirtual: true,
    availability: "This week",
    matchScore: 91,
    bio:
      "Known for quick follow-ups, acne management, and skin screening with clear, plain-language guidance.",
  },
  {
    id: "dr-ibrahim-adele",
    name: "Dr. Ibrahim Adele",
    specialty: "Family Medicine",
    hospital: "GoodHealth Primary Care",
    location: "Prenzlauer Berg",
    rating: 4.7,
    reviews: 98,
    yearsExperience: 17,
    nextAvailable: "Today, 6:10 PM",
    responseTime: "7 min avg",
    consultationFee: 110,
    languages: ["English", "German", "Arabic"],
    tags: ["Annual checkups", "Chronic care", "Pediatrics"],
    verified: true,
    inNetwork: true,
    acceptsVirtual: true,
    availability: "Today",
    matchScore: 96,
    bio:
      "A steady first stop for families who want continuity, medication review, and fast access to care.",
  },
  {
    id: "dr-sofia-mendes",
    name: "Dr. Sofia Mendes",
    specialty: "Mental Health",
    hospital: "Calm Path Clinic",
    location: "Friedrichshain",
    rating: 4.9,
    reviews: 147,
    yearsExperience: 9,
    nextAvailable: "Friday, 1:45 PM",
    responseTime: "15 min avg",
    consultationFee: 170,
    languages: ["English", "German", "Spanish"],
    tags: ["Anxiety", "Burnout", "Video therapy"],
    verified: true,
    inNetwork: true,
    acceptsVirtual: true,
    availability: "This week",
    matchScore: 93,
    bio:
      "Supports patients navigating stress, burnout, and long-term therapy with a calm, structured approach.",
  },
  {
    id: "dr-kofi-badu",
    name: "Dr. Kofi Badu",
    specialty: "Pediatrics",
    hospital: "Little Steps Pediatrics",
    location: "Schoneberg",
    rating: 4.8,
    reviews: 121,
    yearsExperience: 13,
    nextAvailable: "Monday, 8:40 AM",
    responseTime: "11 min avg",
    consultationFee: 125,
    languages: ["English", "German", "Swahili"],
    tags: ["Newborn care", "Vaccines", "School forms"],
    verified: true,
    inNetwork: false,
    acceptsVirtual: true,
    availability: "Next week",
    matchScore: 89,
    bio:
      "A family favorite for well-child visits, vaccinations, and practical guidance for busy parents.",
  },
];

const specialties = [
  "All specialties",
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "Family Medicine",
  "Mental Health",
  "Pediatrics",
] as const;

const availabilityFilters = ["Any time", "Today", "This week"] as const;
const networkFilters = ["Any network", "In network", "Self pay"] as const;
const sortOptions = [
  "Recommended",
  "Top rated",
  "Soonest available",
  "Lowest fee",
] as const;

function matchesSearch(doctor: Doctor, query: string) {
  if (!query) return true;

  const haystack = [
    doctor.name,
    doctor.specialty,
    doctor.hospital,
    doctor.location,
    doctor.bio,
    ...doctor.tags,
    ...doctor.languages,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function DoctorDiscoveryPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] =
    useState<(typeof specialties)[number]>("All specialties");
  const [availability, setAvailability] =
    useState<(typeof availabilityFilters)[number]>("Any time");
  const [network, setNetwork] =
    useState<(typeof networkFilters)[number]>("Any network");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Recommended");
  const [savedDoctors, setSavedDoctors] = useState<Record<string, boolean>>({});
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id ?? "");

  const filteredDoctors = doctors
    .filter((doctor) => matchesSearch(doctor, query))
    .filter((doctor) =>
      specialty === "All specialties" ? true : doctor.specialty === specialty,
    )
    .filter((doctor) => {
      if (availability === "Any time") return true;
      if (availability === "Today") return doctor.availability === "Today";
      return doctor.availability !== "Next week";
    })
    .filter((doctor) => {
      if (network === "Any network") return true;
      return network === "In network" ? doctor.inNetwork : !doctor.inNetwork;
    })
    .sort((a, b) => {
      if (sort === "Top rated") return b.rating - a.rating;
      if (sort === "Soonest available") {
        const order = { Today: 0, "This week": 1, "Next week": 2 } as const;
        return order[a.availability] - order[b.availability];
      }
      if (sort === "Lowest fee") return a.consultationFee - b.consultationFee;

      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return b.rating - a.rating;
    });

  const selectedDoctor =
    filteredDoctors.find((doctor) => doctor.id === selectedDoctorId) ??
    filteredDoctors[0] ??
    null;

  const toggleSaved = (doctorId: string) => {
    setSavedDoctors((current) => ({
      ...current,
      [doctorId]: !current[doctorId],
    }));
  };

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
            <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-12 left-1/3 h-36 w-36 rounded-full bg-emerald-400/20 blur-3xl" />

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
                    Search by specialty, availability, language, or insurance
                    network, then compare the doctors who can help you next.
                  </Body>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <HeroStat label="Verified doctors" value={doctors.length} />
                  <HeroStat
                    label="Available today"
                    value={doctors.filter((doctor) => doctor.availability === "Today").length}
                  />
                  <HeroStat label="Avg rating" value="4.8" />
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
                      placeholder="Cardiology, Berlin Mitte, virtual consults..."
                      className="h-12 w-full rounded-xl border border-white/15 bg-slate-900/60 px-4 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <select
                      value={specialty}
                      onChange={(event) =>
                        setSpecialty(event.target.value as typeof specialty)
                      }
                      className="h-11 rounded-xl border border-white/15 bg-slate-900/60 px-3 text-sm text-white outline-none transition focus:border-cyan-300"
                    >
                      {specialties.map((value) => (
                        <option key={value} value={value} className="text-slate-950">
                          {value}
                        </option>
                      ))}
                    </select>
                    <select
                      value={availability}
                      onChange={(event) =>
                        setAvailability(event.target.value as typeof availability)
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
                  </div>
                </CardBody>
              </Card>
            </div>
          </section>

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

          <Alert variant="info">
            <AlertTitle>Care coverage</AlertTitle>
            <AlertDescription>
              In-network doctors are highlighted first when you keep the
              recommended sort selected. You can still review every available
              specialist if you want a broader search.
            </AlertDescription>
          </Alert>

          <Grid columns={4} gap="md">
            <Metric label="Matched doctors" value={filteredDoctors.length} />
            <Metric
              label="Virtual available"
              value={filteredDoctors.filter((doctor) => doctor.acceptsVirtual).length}
            />
            <Metric
              label="In network"
              value={filteredDoctors.filter((doctor) => doctor.inNetwork).length}
            />
            <Metric
              label="Saved today"
              value={Object.values(savedDoctors).filter(Boolean).length}
            />
          </Grid>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)]">
            <section className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <H2>Available doctors</H2>
                  <Body muted>
                    Compare bios, availability, and consultation style before
                    choosing a profile.
                  </Body>
                </div>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as typeof sort)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-sky-500"
                >
                  {sortOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => {
                    const saved = Boolean(savedDoctors[doctor.id]);
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
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")}
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <CardTitle size="lg">{doctor.name}</CardTitle>
                                  {doctor.verified && (
                                    <Badge variant="success" size="sm">
                                      Verified
                                    </Badge>
                                  )}
                                  {doctor.featured && (
                                    <Badge variant="primary" size="sm">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <Body size="sm" muted>
                                  {doctor.specialty} at {doctor.hospital}
                                </Body>
                                <Text muted>{doctor.location}</Text>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 sm:justify-end">
                              <Badge variant="default" outlined>
                                {doctor.availability}
                              </Badge>
                              <Badge variant={doctor.inNetwork ? "success" : "warning"}>
                                {doctor.inNetwork ? "In network" : "Self pay"}
                              </Badge>
                            </div>
                          </div>

                          <Body size="sm" muted>
                            {doctor.bio}
                          </Body>

                          <div className="flex flex-wrap gap-2">
                            {doctor.tags.map((tag) => (
                              <Badge key={tag} variant="info" size="sm" outlined>
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <InfoBlock label="Rating" value={`${doctor.rating} (${doctor.reviews})`} />
                            <InfoBlock label="Experience" value={`${doctor.yearsExperience} years`} />
                            <InfoBlock label="Next available" value={doctor.nextAvailable} />
                            <InfoBlock
                              label="Fee"
                              value={`$${doctor.consultationFee} consult`}
                            />
                          </div>
                        </CardBody>

                        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default" outlined>
                              {doctor.acceptsVirtual ? "Virtual care" : "In-person only"}
                            </Badge>
                            <Badge variant="secondary" outlined>
                              {doctor.responseTime}
                            </Badge>
                            <Badge variant="primary" outlined>
                              Match {doctor.matchScore}%
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleSaved(doctor.id);
                              }}
                            >
                              {saved ? "Saved" : "Save"}
                            </Button>
                            <Button
                              type="button"
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
                                href={`/patient/appointments?doctor=${doctor.id}&type=${doctor.acceptsVirtual ? "video" : "in-person"}`}
                                onClick={(event) => event.stopPropagation()}
                              >
                                Book visit
                              </Link>
                            </Button>
                          </div>
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
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle size="lg">Selected doctor</CardTitle>
                      <Body size="sm" muted className="mt-1">
                        A quick snapshot of the profile you are currently
                        exploring.
                      </Body>
                    </div>
                    <Badge variant="info" outlined>
                      Live preview
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  {selectedDoctor ? (
                    <Stack spacing="lg">
                      <div className="flex items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-sky-700 text-lg font-bold text-white">
                          {selectedDoctor.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <div className="space-y-1">
                          <H3>{selectedDoctor.name}</H3>
                          <Body size="sm" muted>
                            {selectedDoctor.specialty}
                          </Body>
                          <Text muted>{selectedDoctor.hospital}</Text>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <InfoBlock label="Location" value={selectedDoctor.location} />
                        <InfoBlock label="Availability" value={selectedDoctor.nextAvailable} />
                        <InfoBlock
                          label="Consult fee"
                          value={`$${selectedDoctor.consultationFee}`}
                        />
                        <InfoBlock
                          label="Response time"
                          value={selectedDoctor.responseTime}
                        />
                      </div>

                      <div className="space-y-2">
                        <Text className="font-semibold text-gray-900">
                          Languages
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoctor.languages.map((language) => (
                            <Badge key={language} variant="default" outlined size="sm">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Text className="font-semibold text-gray-900">
                          Focus areas
                        </Text>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoctor.tags.map((tag) => (
                            <Badge key={tag} variant="primary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Alert variant="info">
                        <AlertTitle>Match score {selectedDoctor.matchScore}%</AlertTitle>
                        <AlertDescription>
                          This profile ranks highly based on your current search
                          filters and recommended sort order.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 gap-3">
                        <Button asChild variant="outline">
                          <Link href="/patient/membership">Check coverage</Link>
                        </Button>
                        <Button
                          type="button"
                          onClick={() => toggleSaved(selectedDoctor.id)}
                        >
                          {savedDoctors[selectedDoctor.id] ? "Unsave" : "Save"}
                        </Button>
                      </div>
                      <Button asChild className="w-full">
                        <Link
                          href={`/patient/appointments?doctor=${selectedDoctor.id}&type=${selectedDoctor.acceptsVirtual ? "video" : "in-person"}`}
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

              <Card className="border-slate-200 bg-gradient-to-br from-sky-50 to-emerald-50">
                <CardBody className="space-y-4">
                  <div>
                    <Badge variant="success" outlined>
                      Next step
                    </Badge>
                    <H3 className="mt-3">Need a membership before booking?</H3>
                    <Body size="sm" muted className="mt-2">
                      Some doctors are in network, and others are self pay. If
                      you want access to the membership benefits, review the
                      available plans next.
                    </Body>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/patient/membership">Browse membership plans</Link>
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
