"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PatientShellClient, type PatientUser } from "@/components/patient/patient-shell-client";
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

type Props = {
  user: PatientUser;
};

export function DoctorDiscoveryClient({ user }: Props) {
  const [doctors, setDoctors] = useState<AvailableDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState<(typeof availabilityFilters)[number]>("Any time");
  const [network, setNetwork] = useState<(typeof networkFilters)[number]>("Any network");
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

  useEffect(() => {
    if (specialty !== "All specialties" && !specialties.includes(specialty)) {
      setSpecialty("All specialties");
    }
  }, [specialties, specialty]);

  const filteredDoctors = useMemo(() => {
    return doctors
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
        return (
          (b.yearsOfExperience ?? 0) - (a.yearsOfExperience ?? 0) ||
          a.consultationFee - b.consultationFee
        );
      });
  }, [doctors, query, specialty, availability, network, sort]);

  const selectedDoctor =
    filteredDoctors.find((doctor) => doctor.id === selectedDoctorId) ??
    filteredDoctors[0] ??
    null;

  return (
    <PatientShellClient user={user} title="Find Practitioner">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#1a1a1a] lg:text-3xl">Find Practitioner</h1>
        <p className="text-sm text-[#6b6b6b]">Discover, compare, and book verified healthcare professionals.</p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {/* Advanced Filter Card */}
      <div className="mb-8 rounded-2xl border border-[#eeece8] bg-white p-5 space-y-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, clinic, bio…"
            className="w-full sm:col-span-2 rounded-xl border border-[#eeece8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none placeholder:text-[#b0b0b0] focus:border-[#2641FF] focus:ring-2 focus:ring-[#2641FF]/10 transition"
          />
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value as any)}
            className="rounded-xl border border-[#eeece8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#2641FF] transition"
          >
            {availabilityFilters.map((val) => <option key={val} value={val}>{val}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-xl border border-[#eeece8] bg-white px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#2641FF] transition"
          >
            {sortOptions.map((val) => <option key={val} value={val}>{val}</option>)}
          </select>
        </div>

        {/* Specialty Filter Buttons */}
        {specialties.length > 1 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#f5f5f5]">
            {specialties.map((value) => {
              const active = specialty === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSpecialty(value)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-semibold border transition",
                    active
                      ? "border-[#2641FF] bg-[#eef0ff]/30 text-[#2641FF]"
                      : "border-[#eeece8] bg-white text-[#6b6b6b] hover:border-[#b0b0b0]",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1.1fr]">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#1a1a1a] mb-2">Practitioner Directory ({filteredDoctors.length})</h2>

          {loading ? (
            <div className="rounded-2xl border border-[#eeece8] bg-white p-8 text-center text-sm text-[#9b9b9b]">
              Loading verified doctors…
            </div>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => {
              const active = selectedDoctor?.id === doctor.id;
              return (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctorId(doctor.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl border bg-white p-5 transition hover:shadow-md space-y-4",
                    active ? "border-[#2641FF] ring-2 ring-[#2641FF]/10" : "border-[#eeece8]",
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-base font-bold text-[#2641FF]">
                        {doctor.name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("")}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[#1a1a1a]">{doctor.name}</span>
                          <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-[#6b6b6b]">
                          {doctor.specialty ?? "General"} • {doctor.hospitalName ?? "Virtual Clinic"}
                        </p>
                        {doctor.location && <p className="text-xs text-[#9b9b9b]">{doctor.location}</p>}
                      </div>
                    </div>

                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto",
                      doctor.supportsVirtualConsultation ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                      {doctor.supportsVirtualConsultation ? "Video Visit Ready" : "In-Person Only"}
                    </span>
                  </div>

                  {doctor.bio && <p className="text-xs text-[#6b6b6b] leading-relaxed line-clamp-2">{doctor.bio}</p>}

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#f5f5f5] pt-3">
                    <div className="flex items-center justify-between text-[#6b6b6b]">
                      <span>Experience</span>
                      <span className="font-semibold text-[#1a1a1a]">{doctor.yearsOfExperience ? `${doctor.yearsOfExperience} yrs` : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#6b6b6b] pl-4 border-l border-[#eeece8]">
                      <span>Consultation Fee</span>
                      <span className="font-semibold text-[#1a1a1a]">₦{doctor.consultationFee}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-[#eeece8] bg-white p-12 text-center text-sm text-[#6b6b6b]">
              No practitioners match these filter combinations.
            </div>
          )}
        </div>

        {/* Selected Doctor Sidebar Detail */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {selectedDoctor ? (
            <div className="rounded-2xl border border-[#eeece8] bg-white p-6 space-y-6">
              <div className="border-b border-[#eeece8] pb-4">
                <h3 className="text-sm font-bold text-[#1a1a1a]">Selected Practitioner</h3>
                <p className="text-[10px] text-[#6b6b6b] mt-0.5">Practitioner profile details and bio.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eef0ff] text-lg font-bold text-[#2641FF]">
                  {selectedDoctor.name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#1a1a1a]">{selectedDoctor.name}</h4>
                  <p className="text-xs text-[#6b6b6b]">{selectedDoctor.specialty ?? "General Practice"}</p>
                  <p className="text-xs text-[#9b9b9b]">{selectedDoctor.hospitalName ?? "GoodHealth Network"}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs border-y border-[#eeece8] py-4">
                <div className="flex justify-between">
                  <span className="text-[#6b6b6b]">Location</span>
                  <span className="font-semibold">{selectedDoctor.location ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b6b6b]">Consultation Fee</span>
                  <span className="font-semibold text-emerald-700">₦{selectedDoctor.consultationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b6b6b]">Years of Practice</span>
                  <span className="font-semibold">{selectedDoctor.yearsOfExperience ? `${selectedDoctor.yearsOfExperience} years` : "—"}</span>
                </div>
              </div>

              {selectedDoctor.bio && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#9b9b9b] uppercase tracking-wide">Bio</span>
                  <p className="text-xs text-[#6b6b6b] leading-relaxed">{selectedDoctor.bio}</p>
                </div>
              )}

              <Link
                href={`/patient/appointments?doctor=${selectedDoctor.id}&type=${selectedDoctor.supportsVirtualConsultation ? "video" : "in-person"}`}
                className="block w-full text-center rounded-full bg-[#2641FF] py-3 text-xs font-semibold text-white shadow-lg shadow-[#2641FF]/20 transition hover:bg-[#1a30e8] active:scale-95"
              >
                Book Visit
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#eeece8] bg-white p-8 text-center text-xs text-[#9b9b9b]">
              Please pick a profile from the directory search list.
            </div>
          )}
        </div>
      </div>
    </PatientShellClient>
  );
}
