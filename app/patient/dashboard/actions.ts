import "server-only";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import {
  UserRole,
  MembershipStatus,
  AppointmentStatus,
} from "@/app/generated/prisma/enums";

export type DashboardData = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
    profileCompleted: boolean;
    profileCompletionPercentage: number;
  };
  membership: {
    planName: string;
    status: string;
    endDate: Date;
  } | null;
  upcomingAppointments: {
    id: string;
    hospitalName: string;
    hospitalLocation: string;
    hospitalPhone: string | null;
    doctorName: string;
    appointmentDate: Date;
    appointmentStartTime: Date;
    appointmentStatus: string;
    appointmentType: string;
  }[];
  pastAppointments: {
    id: string;
    hospitalName: string;
    hospitalLocation: string;
    hospitalPhone: string | null;
    doctorName: string;
    appointmentDate: Date;
    appointmentStartTime: Date;
    appointmentStatus: string;
    appointmentType: string;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const authUser = await requireRole([UserRole.PATIENT]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      profileImageUrl: true,
      patientProfile: {
        select: {
          id: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          membershipSubscriptions: {
            where: { status: MembershipStatus.ACTIVE },
            take: 1,
            orderBy: { endDate: "desc" },
            select: {
              status: true,
              endDate: true,
              membershipPlan: {
                select: { name: true },
              },
            },
          },
          appointments: {
            where: {
              appointmentDate: { gte: new Date() },
              appointmentStatus: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
            },
            orderBy: [
              { appointmentDate: "asc" },
              { appointmentStartTime: "asc" },
            ],
            take: 5,
            select: {
              id: true,
              appointmentDate: true,
              appointmentStartTime: true,
              appointmentStatus: true,
              appointmentType: true,
              doctor: {
                select: {
                  user: {
                    select: { firstName: true, lastName: true },
                  },
                },
              },
              hospital: {
                select: {
                  name: true,
                  city: true,
                  state: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          message: true,
          isRead: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const profile = user.patientProfile;
  const activeMembership = profile?.membershipSubscriptions?.[0] ?? null;

  // Determine profile completeness
  let filledFields = 0;
  if (profile?.dateOfBirth) filledFields++;
  if (profile?.gender) filledFields++;
  if (profile?.address) filledFields++;
  if (profile?.emergencyContactName) filledFields++;
  if (profile?.emergencyContactPhone) filledFields++;
  const profileCompletionPercentage = filledFields * 20;
  const profileCompleted = filledFields === 5;

  // Fetch past appointments
  const pastApts = profile
    ? await prisma.appointment.findMany({
        where: {
          patientId: profile.id,
          OR: [
            { appointmentDate: { lt: new Date() } },
            {
              appointmentStatus: {
                in: [
                  AppointmentStatus.COMPLETED,
                  AppointmentStatus.CANCELLED,
                  AppointmentStatus.NO_SHOW,
                ],
              },
            },
          ],
        },
        orderBy: [
          { appointmentDate: "desc" },
          { appointmentStartTime: "desc" },
        ],
        take: 5,
        select: {
          id: true,
          appointmentDate: true,
          appointmentStartTime: true,
          appointmentStatus: true,
          appointmentType: true,
          doctor: {
            select: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          hospital: {
            select: {
              name: true,
              city: true,
              state: true,
              phoneNumber: true,
            },
          },
        },
      })
    : [];

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      profileCompleted,
      profileCompletionPercentage,
    },
    membership: activeMembership
      ? {
          planName: activeMembership.membershipPlan.name,
          status: activeMembership.status,
          endDate: activeMembership.endDate,
        }
      : null,
    upcomingAppointments: (profile?.appointments ?? []).map((apt) => ({
      id: apt.id,
      hospitalName: apt.hospital?.name ?? "Virtual Consultation",
      hospitalLocation: apt.hospital
        ? `${apt.hospital.city}, ${apt.hospital.state}`
        : "Online",
      hospitalPhone: apt.hospital?.phoneNumber ?? null,
      doctorName: `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`,
      appointmentDate: apt.appointmentDate,
      appointmentStartTime: apt.appointmentStartTime,
      appointmentStatus: apt.appointmentStatus,
      appointmentType: apt.appointmentType,
    })),
    pastAppointments: pastApts.map((apt) => ({
      id: apt.id,
      hospitalName: apt.hospital?.name ?? "Virtual Consultation",
      hospitalLocation: apt.hospital
        ? `${apt.hospital.city}, ${apt.hospital.state}`
        : "Online",
      hospitalPhone: apt.hospital?.phoneNumber ?? null,
      doctorName: `Dr. ${apt.doctor.user.firstName} ${apt.doctor.user.lastName}`,
      appointmentDate: apt.appointmentDate,
      appointmentStartTime: apt.appointmentStartTime,
      appointmentStatus: apt.appointmentStatus,
      appointmentType: apt.appointmentType,
    })),
    notifications: user.notifications,
  };
}
