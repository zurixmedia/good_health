import "server-only";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import {
  UserRole,
  AppointmentStatus,
  ConsultationStatus,
} from "@/app/generated/prisma/enums";

export type DoctorDashboardData = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
  };
  doctor: {
    id: string;
    specializationName: string | null;
    verificationStatus: string;
    yearsOfExperience: number | null;
    consultationFee: number | null;
    supportsVirtualConsultation: boolean;
    bio: string | null;
  };
  todaysAppointments: {
    id: string;
    patientName: string;
    patientInitials: string;
    reasonForVisit: string;
    appointmentDate: Date;
    appointmentStartTime: Date;
    appointmentEndTime: Date;
    appointmentStatus: string;
    appointmentType: string;
    hospitalName: string | null;
    hospitalLocation: string | null;
    hasConsultation: boolean;
  }[];
  consultationHistory: {
    id: string;
    appointmentId: string;
    patientName: string;
    appointmentDate: Date;
    appointmentStartTime: Date;
    appointmentStatus: string;
    appointmentType: string;
    consultationStatus: string | null;
    diagnosis: string | null;
    recommendations: string | null;
  }[];
  availability: {
    id: string;
    dayOfWeek: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
  }[];
  earnings: {
    todayCount: number;
    weekCount: number;
    monthCount: number;
    totalCount: number;
    todayAmount: number;
    weekAmount: number;
    monthAmount: number;
    totalAmount: number;
  };
  notifications: {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }[];
};

const DAYS_PER_WEEK = 7;
const MONDAY_OFFSET = 1;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Returns the start (Monday 00:00) and end (Sunday 23:59) of the current week.
 */
function getWeekRange(now: Date): { start: Date; end: Date } {
  const day = now.getDay(); // 0 = Sunday
  const diffToMonday = (day + DAYS_PER_WEEK - MONDAY_OFFSET) % DAYS_PER_WEEK;
  const start = startOfDay(new Date(now));
  start.setDate(start.getDate() - diffToMonday);
  const end = endOfDay(new Date(start));
  end.setDate(end.getDate() + (DAYS_PER_WEEK - 1));
  return { start, end };
}

function getMonthRange(now: Date): { start: Date; end: Date } {
  const start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
  const end = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));
  return { start, end };
}

export async function getDoctorDashboardData(): Promise<DoctorDashboardData> {
  const authUser = await requireRole([UserRole.DOCTOR]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      profileImageUrl: true,
      doctorProfile: {
        select: {
          id: true,
          verificationStatus: true,
          yearsOfExperience: true,
          consultationFee: true,
          supportsVirtualConsultation: true,
          bio: true,
          specialization: { select: { name: true } },
          availabilityRules: {
            where: { isActive: true },
            orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
            select: {
              id: true,
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              isActive: true,
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

  if (!user || !user.doctorProfile) {
    throw new Error("Doctor profile not found");
  }

  const doctorId = user.doctorProfile.id;
  const consultationFee = user.doctorProfile.consultationFee
    ? Number(user.doctorProfile.consultationFee)
    : 0;

  const now = new Date();
  const dayStart = startOfDay(now);
  const dayEnd = endOfDay(now);
  const { start: weekStart, end: weekEnd } = getWeekRange(now);
  const { start: monthStart, end: monthEnd } = getMonthRange(now);

  // Today's appointments (patient queue) — pending or confirmed, ordered by start time.
  const todaysAppointmentsRaw = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: { gte: dayStart, lte: dayEnd },
      appointmentStatus: {
        in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
      },
    },
    orderBy: [{ appointmentStartTime: "asc" }],
    take: 10,
    select: {
      id: true,
      reasonForVisit: true,
      appointmentDate: true,
      appointmentStartTime: true,
      appointmentEndTime: true,
      appointmentStatus: true,
      appointmentType: true,
      hospital: {
        select: { name: true, city: true, state: true },
      },
      patient: {
        select: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
      consultation: { select: { id: true } },
    },
  });

  // Consultation history — past terminal-status appointments, most recent first.
  const historyRaw = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentStatus: {
        in: [
          AppointmentStatus.COMPLETED,
          AppointmentStatus.CANCELLED,
          AppointmentStatus.NO_SHOW,
        ],
      },
    },
    orderBy: [
      { appointmentDate: "desc" },
      { appointmentStartTime: "desc" },
    ],
    take: 6,
    select: {
      id: true,
      appointmentDate: true,
      appointmentStartTime: true,
      appointmentStatus: true,
      appointmentType: true,
      patient: {
        select: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
      consultation: {
        select: { status: true, diagnosis: true, recommendations: true },
      },
    },
  });

  // Earnings — counts of completed appointments + estimated amounts (fee × count).
  const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
    prisma.appointment.count({
      where: {
        doctorId,
        appointmentStatus: AppointmentStatus.COMPLETED,
        appointmentDate: { gte: dayStart, lte: dayEnd },
      },
    }),
    prisma.appointment.count({
      where: {
        doctorId,
        appointmentStatus: AppointmentStatus.COMPLETED,
        appointmentDate: { gte: weekStart, lte: weekEnd },
      },
    }),
    prisma.appointment.count({
      where: {
        doctorId,
        appointmentStatus: AppointmentStatus.COMPLETED,
        appointmentDate: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.appointment.count({
      where: {
        doctorId,
        appointmentStatus: AppointmentStatus.COMPLETED,
      },
    }),
  ]);

  const patientName = (p: { user: { firstName: string; lastName: string } }) =>
    `${p.user.firstName} ${p.user.lastName}`;

  const patientInitials = (
    p: { user: { firstName: string; lastName: string } },
  ) =>
    `${p.user.firstName.charAt(0)}${p.user.lastName.charAt(0)}`.toUpperCase();

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    },
    doctor: {
      id: user.doctorProfile.id,
      specializationName: user.doctorProfile.specialization?.name ?? null,
      verificationStatus: user.doctorProfile.verificationStatus,
      yearsOfExperience: user.doctorProfile.yearsOfExperience,
      consultationFee,
      supportsVirtualConsultation: user.doctorProfile.supportsVirtualConsultation,
      bio: user.doctorProfile.bio,
    },
    todaysAppointments: todaysAppointmentsRaw.map((apt) => ({
      id: apt.id,
      patientName: patientName(apt.patient),
      patientInitials: patientInitials(apt.patient),
      reasonForVisit: apt.reasonForVisit,
      appointmentDate: apt.appointmentDate,
      appointmentStartTime: apt.appointmentStartTime,
      appointmentEndTime: apt.appointmentEndTime,
      appointmentStatus: apt.appointmentStatus,
      appointmentType: apt.appointmentType,
      hospitalName: apt.hospital?.name ?? null,
      hospitalLocation: apt.hospital
        ? `${apt.hospital.city}, ${apt.hospital.state}`
        : null,
      hasConsultation: Boolean(apt.consultation),
    })),
    consultationHistory: historyRaw.map((apt) => ({
      id: apt.id,
      appointmentId: apt.id,
      patientName: patientName(apt.patient),
      appointmentDate: apt.appointmentDate,
      appointmentStartTime: apt.appointmentStartTime,
      appointmentStatus: apt.appointmentStatus,
      appointmentType: apt.appointmentType,
      consultationStatus: apt.consultation?.status ?? null,
      diagnosis: apt.consultation?.diagnosis ?? null,
      recommendations: apt.consultation?.recommendations ?? null,
    })),
    availability: user.doctorProfile.availabilityRules,
    earnings: {
      todayCount,
      weekCount,
      monthCount,
      totalCount,
      todayAmount: todayCount * consultationFee,
      weekAmount: weekCount * consultationFee,
      monthAmount: monthCount * consultationFee,
      totalAmount: totalCount * consultationFee,
    },
    notifications: user.notifications,
  };
}

export { ConsultationStatus };
