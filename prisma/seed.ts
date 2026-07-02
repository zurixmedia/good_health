/**
 * GoodHealth — database seed script.
 *
 * Idempotent: every insert uses `skipDuplicates` so re-running is safe.
 * Wraps all work in a single transaction so a partial failure rolls back cleanly.
 *
 * Run:  npx tsx prisma/seed.ts
 *      npm run seed
 */

import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

// ---------------------------------------------------------------------------
// Instantiation
//
// Prisma v7 requires a driver adapter. We mirror the setup used in
// `lib/db/prisma.ts` so the seed connects through the same pg path.
// ---------------------------------------------------------------------------

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Reference data — all values come from DATABASE_SCHEMA.md examples and the
// Nigerian healthcare context the platform targets (+234, Naira, Lagos).
// ---------------------------------------------------------------------------

const SPECIALIZATIONS = [
  {
    name: "Cardiology",
    description:
      "Diagnosis and treatment of heart and blood vessel disorders.",
    icon: "heart-pulse",
  },
  {
    name: "Dentistry",
    description: "Oral health, dental surgery, and preventive care.",
    icon: "smile",
  },
  {
    name: "Pediatrics",
    description: "Medical care for infants, children, and adolescents.",
    icon: "baby",
  },
  {
    name: "Dermatology",
    description:
      "Conditions of the skin, hair, nails, and mucous membranes.",
    icon: "hand",
  },
  {
    name: "Orthopedics",
    description: "Musculoskeletal system injuries and conditions.",
    icon: "bone",
  },
  {
    name: "Optometry",
    description: "Eye examinations, vision correction, and eye health.",
    icon: "eye",
  },
] as const;

const HOSPITALS = [
  {
    name: "Lagos University Teaching Hospital",
    description:
      "A premier tertiary healthcare institution providing comprehensive medical services.",
    address: "Idi-Araba, Surulere",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    phoneNumber: "+234 1 793 4444",
    email: "info@luth.gov.ng",
    isActive: true,
  },
  {
    name: "St. Nicholas Hospital",
    description:
      "A leading private hospital offering multi-specialty healthcare services.",
    address: "57A, Campbell Avenue",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    phoneNumber: "+234 1 262 0078",
    email: "info@stnicholashospital.com",
    isActive: true,
  },
  {
    name: "Reddington Hospital",
    description:
      "A state-of-the-art multi-specialist hospital committed to advanced healthcare.",
    address: "12, Idowu Martins Street",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    phoneNumber: "+234 1 277 7500",
    email: "info@reddingtonhospital.com",
    isActive: true,
  },
] as const;

/**
 * Membership plans — amounts in Nigerian Naira (NGN).
 *
 * DATABASE_SCHEMA.md examples: "Individual Plan", "Family Plan", "Premium Plan".
 * Monthly pricing follows realistic Nigerian healthcare subscription tiers.
 */
const MEMBERSHIP_PLANS = [
  {
    name: "Individual Plan",
    description:
      "Essential healthcare coverage for one person — includes routine check-ups, virtual consultations, and specialist referrals.",
    monthlyPrice: 5000,
    yearlyPrice: 50000,
    consultationLimit: 12,
    supportsVirtualConsultation: true,
    isActive: true,
  },
  {
    name: "Family Plan",
    description:
      "Comprehensive coverage for the whole family — up to 4 members, unlimited virtual consultations, and priority scheduling.",
    monthlyPrice: 12000,
    yearlyPrice: 120000,
    consultationLimit: 48,
    supportsVirtualConsultation: true,
    isActive: true,
  },
  {
    name: "Premium Plan",
    description:
      "Unlimited access to all healthcare services — unlimited consultations, dedicated health advisor, and fast-track appointments.",
    monthlyPrice: 25000,
    yearlyPrice: 250000,
    consultationLimit: null,
    supportsVirtualConsultation: true,
    isActive: true,
  },
] as const;

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------

async function seed() {
  console.log("🌱  Seeding GoodHealth database…");

  await prisma.$transaction(
    async (tx) => {
      // ── Specializations ────────────────────────────────────────────────
      const specResult = await tx.specialization.createMany({
        data: SPECIALIZATIONS.map((s) => ({ ...s })),
        skipDuplicates: true,
      });
      console.log(`  ✓ Specializations  ${specResult.count} created`);

      // ── Hospitals ──────────────────────────────────────────────────────
      const hospResult = await tx.hospital.createMany({
        data: HOSPITALS.map((h) => ({ ...h })),
        skipDuplicates: true,
      });
      console.log(`  ✓ Hospitals       ${hospResult.count} created`);

      // ── Membership Plans ───────────────────────────────────────────────
      const planResult = await tx.membershipPlan.createMany({
        data: MEMBERSHIP_PLANS.map((p) => ({ ...p })),
        skipDuplicates: true,
      });
      console.log(`  ✓ Membership Plans ${planResult.count} created`);

      // ── Admin user (placeholder Clerk ID) ────────────────────────────────
      // This record is paired with the actual Clerk admin account. The
      // clerkId should be replaced with the real value from the Clerk
      // dashboard after the first admin signs up.
      const adminEmail = "admin@goodhealth.com";
      const adminClerkId = "admin_placeholder";

      const existingAdmin = await tx.user.findUnique({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        await tx.user.create({
          data: {
            clerkId: adminClerkId,
            email: adminEmail,
            firstName: "GoodHealth",
            lastName: "Admin",
            role: "ADMIN",
            isActive: true,
          },
        });
        console.log(`  ✓ Admin user     admin@goodhealth.com created`);
      } else {
        console.log(`  ✓ Admin user     already exists — skipped`);
      }
    },
    {
      timeout: 30_000,
    },
  );

  console.log("✅  Seed complete.");
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("❌  Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
