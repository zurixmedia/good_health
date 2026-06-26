export type ConsultationStatus = "scheduled" | "live" | "completed";

export type ConsultationSession = {
  id: string;
  appointmentId: string;
  doctorName: string;
  specialty: string;
  patientName: string;
  dateLabel: string;
  timeLabel: string;
  duration: string;
  status: ConsultationStatus;
  provider: "Daily.co";
  roomName: string;
  reason: string;
  notes: string;
  location: string;
  connection: "excellent" | "good" | "fair";
  followUp: string;
  participants: string[];
  checklist: string[];
  transcriptSummary: string[];
  prescription?: string;
  recommendedFollowUp?: string;
  canJoin: boolean;
};

export const consultationSessions: ConsultationSession[] = [
  {
    id: "vc-1001",
    appointmentId: "apt-2041",
    doctorName: "Dr. Amara Bello",
    specialty: "Cardiology",
    patientName: "You",
    dateLabel: "Today, June 24",
    timeLabel: "4:30 PM",
    duration: "25 min",
    status: "live",
    provider: "Daily.co",
    roomName: "goodhealth-consult-2041",
    reason: "Follow-up on chest pressure and recent palpitations.",
    notes: "Review blood pressure trend, medication timing, and activity limits.",
    location: "Secure video room",
    connection: "excellent",
    followUp: "Blood pressure log review in 2 weeks.",
    participants: ["You", "Dr. Amara Bello"],
    checklist: [
      "Camera and microphone ready",
      "Blood pressure readings nearby",
      "Medication list open",
      "Quiet room and headphones available",
    ],
    transcriptSummary: [
      "Symptoms have improved since the last visit.",
      "Continue the current medication schedule.",
      "Share home readings over the next 14 days.",
    ],
    prescription: "No new prescription today.",
    recommendedFollowUp: "Book a physical visit if symptoms intensify.",
    canJoin: true,
  },
  {
    id: "vc-1002",
    appointmentId: "apt-2048",
    doctorName: "Dr. Sofia Mendes",
    specialty: "Mental Health",
    patientName: "You",
    dateLabel: "Friday, June 27",
    timeLabel: "1:45 PM",
    duration: "45 min",
    status: "scheduled",
    provider: "Daily.co",
    roomName: "goodhealth-consult-2048",
    reason: "Burnout check-in and sleep support.",
    notes: "Discuss weekly workload, stress triggers, and coping tools.",
    location: "Secure video room",
    connection: "good",
    followUp: "Therapy follow-up in 4 weeks.",
    participants: ["You", "Dr. Sofia Mendes"],
    checklist: [
      "Find a private space",
      "Keep notes on sleep patterns",
      "Have water and tissues nearby",
      "Join from your phone if needed",
    ],
    transcriptSummary: [
      "Upcoming session prepared for stress management discussion.",
      "Focus on sleep consistency and work boundaries.",
    ],
    recommendedFollowUp: "Share your sleep notes after the session.",
    canJoin: true,
  },
  {
    id: "vc-1003",
    appointmentId: "apt-2017",
    doctorName: "Dr. Lina Park",
    specialty: "Dermatology",
    patientName: "You",
    dateLabel: "Monday, June 23",
    timeLabel: "10:15 AM",
    duration: "20 min",
    status: "completed",
    provider: "Daily.co",
    roomName: "goodhealth-consult-2017",
    reason: "Rash review and acne follow-up.",
    notes: "Discussed skin care routine, triggers, and topical treatment plan.",
    location: "Secure video room",
    connection: "excellent",
    followUp: "Message photos in 6 weeks if symptoms change.",
    participants: ["You", "Dr. Lina Park"],
    checklist: [
      "Photos reviewed",
      "Prescription sent",
      "Follow-up instructions saved",
    ],
    transcriptSummary: [
      "Skin symptoms are responding to treatment.",
      "Continue the topical routine for another month.",
      "Update photos if irritation returns.",
    ],
    prescription: "Topical treatment plan updated.",
    recommendedFollowUp: "Self-check skin in 6 weeks.",
    canJoin: false,
  },
  {
    id: "vc-1004",
    appointmentId: "apt-2051",
    doctorName: "Dr. Ibrahim Adele",
    specialty: "Family Medicine",
    patientName: "You",
    dateLabel: "Saturday, June 28",
    timeLabel: "9:00 AM",
    duration: "30 min",
    status: "scheduled",
    provider: "Daily.co",
    roomName: "goodhealth-consult-2051",
    reason: "Annual review and medication check.",
    notes: "Prepare recent lab values and refill questions.",
    location: "Secure video room",
    connection: "good",
    followUp: "Annual physical may be recommended after review.",
    participants: ["You", "Dr. Ibrahim Adele"],
    checklist: [
      "Recent labs accessible",
      "Medication bottles nearby",
      "Questions listed in order",
      "Insurance details ready",
    ],
    transcriptSummary: [
      "Care plan to be updated after the next session.",
      "Lab review will guide whether an in-person exam is needed.",
    ],
    recommendedFollowUp: "Consider an in-person exam if the doctor advises it.",
    canJoin: true,
  },
];

export function getConsultationById(consultationId: string) {
  return consultationSessions.find((session) => session.id === consultationId);
}

