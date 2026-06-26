export type NotificationCategory =
  | "appointments"
  | "consultations"
  | "membership"
  | "system";

export type NotificationItem = {
  id: string;
  type: string;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
  actionLabel: string;
  href: string;
  relatedName?: string;
};

export const notificationItems: NotificationItem[] = [
  {
    id: "notif-1001",
    type: "appointment.created",
    category: "appointments",
    title: "Appointment confirmed",
    message:
      "Your cardiology appointment with Dr. Amara Bello is booked for today at 4:30 PM.",
    createdAt: "2026-06-24T08:20:00Z",
    isRead: false,
    priority: "high",
    actionLabel: "View appointment",
    href: "/patient/appointments",
    relatedName: "Dr. Amara Bello",
  },
  {
    id: "notif-1002",
    type: "consultation.reminder",
    category: "consultations",
    title: "Video consultation reminder",
    message:
      "Your secure video room opens in 30 minutes. Please prepare your notes and recent readings.",
    createdAt: "2026-06-24T14:00:00Z",
    isRead: false,
    priority: "high",
    actionLabel: "Join consultations",
    href: "/patient/consultations",
    relatedName: "Daily.co room",
  },
  {
    id: "notif-1003",
    type: "membership.renewal",
    category: "membership",
    title: "Membership payment received",
    message:
      "Your current membership is active and ready for your next visit.",
    createdAt: "2026-06-23T11:10:00Z",
    isRead: true,
    priority: "medium",
    actionLabel: "Review membership",
    href: "/patient/membership/manage",
    relatedName: "GoodHealth Plus",
  },
  {
    id: "notif-1004",
    type: "consultation.completed",
    category: "consultations",
    title: "Consultation summary ready",
    message:
      "Dr. Lina Park has uploaded notes from your completed video consultation.",
    createdAt: "2026-06-23T10:00:00Z",
    isRead: true,
    priority: "medium",
    actionLabel: "Open summary",
    href: "/patient/consultations/vc-1003",
    relatedName: "Dr. Lina Park",
  },
  {
    id: "notif-1005",
    type: "appointment.rescheduled",
    category: "appointments",
    title: "Appointment rescheduled",
    message:
      "Your family medicine appointment has been moved to Saturday, June 28 at 9:00 AM.",
    createdAt: "2026-06-22T15:35:00Z",
    isRead: true,
    priority: "low",
    actionLabel: "View new time",
    href: "/patient/appointments",
    relatedName: "Dr. Ibrahim Adele",
  },
  {
    id: "notif-1006",
    type: "system.security",
    category: "system",
    title: "Secure room check-in",
    message:
      "Only you and your assigned doctor can join active consultation rooms.",
    createdAt: "2026-06-22T09:00:00Z",
    isRead: true,
    priority: "low",
    actionLabel: "Learn more",
    href: "/patient/consultations",
    relatedName: "Security notice",
  },
];

