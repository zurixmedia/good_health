"use client";

import React from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Flex,
  InfoItem,
  Muted,
} from "./index";
import { StatusBadge } from "./badge";

export interface AppointmentInfoProps {
  patientName?: string;
  doctorName?: string;
  specialty?: string;
  date: string;
  time: string;
  type: "in-person" | "video" | "consultation";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  location?: string;
  notes?: string;
}

const typeLabels = {
  "in-person": "In-Person",
  video: "Video Consultation",
  consultation: "Consultation",
};

/**
 * AppointmentInfo
 * Displays appointment details
 */
export function AppointmentInfo({
  patientName,
  doctorName,
  specialty,
  date,
  time,
  type,
  status,
  location,
  notes,
}: AppointmentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <Flex justify="between" align="center">
          <div>
            <CardTitle>{doctorName || "Appointment"}</CardTitle>
            {specialty && <Muted>{specialty}</Muted>}
          </div>
          <StatusBadge status={status} size="sm" />
        </Flex>
      </CardHeader>
      <CardBody className="space-y-3">
        <Flex direction="col" gap="sm">
          <InfoItem label="Date" value={date} />
          <InfoItem label="Time" value={time} />
          <InfoItem
            label="Type"
            value={
              <Badge variant="primary" size="sm">
                {typeLabels[type]}
              </Badge>
            }
          />
          {location && <InfoItem label="Location" value={location} />}
          {patientName && <InfoItem label="Patient" value={patientName} />}
          {notes && <InfoItem label="Notes" value={notes} direction="col" />}
        </Flex>
      </CardBody>
    </Card>
  );
}
