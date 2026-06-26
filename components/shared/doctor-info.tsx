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
} from "./index";

export interface DoctorInfoProps {
  name: string;
  specialty: string;
  qualifications?: string[];
  experience?: string;
  rating?: number;
  reviews?: number;
  image?: React.ReactNode;
  verified?: boolean;
}

/**
 * DoctorInfo
 * Displays doctor information in a compact format
 */
export function DoctorInfo({
  name,
  specialty,
  qualifications,
  experience,
  rating,
  reviews,
  image,
  verified = false,
}: DoctorInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <Flex justify="between" align="center" className="mt-2">
          <span className="text-sm text-gray-600">{specialty}</span>
          {verified && <Badge variant="success">Verified</Badge>}
        </Flex>
      </CardHeader>
      <CardBody className="space-y-3">
        {image && <div>{image}</div>}
        {qualifications && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Qualifications
            </p>
            <div className="flex flex-wrap gap-2">
              {qualifications.map((q) => (
                <Badge key={q} variant="primary" size="sm">
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {experience && <InfoItem label="Experience" value={experience} />}
        {rating && (
          <Flex justify="between" align="center">
            <span className="text-sm text-gray-600">Rating</span>
            <Flex gap="xs" align="center">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{rating}</span>
              {reviews && (
                <span className="text-xs text-gray-600">({reviews})</span>
              )}
            </Flex>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
}
