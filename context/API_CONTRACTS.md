# API Contracts

## Overview

This document defines the API contracts for GoodHealth.

API contracts specify:

- Endpoint
- Method
- Purpose
- Authorization requirements
- Request payload
- Response payload
- Validation rules

All APIs must enforce:

- Authentication
- Authorization
- Business Rules
- Ownership Validation

Responses should be consistent across the platform.

---

# Response Standards

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "error": {
    "message": "Human readable message"
  }
}
```

---

# Authentication APIs

## Get Current User

Endpoint:

```text
GET /api/auth/me
```

Authorization:

Authenticated User

Purpose:

Return currently authenticated user.

Response:

```json
{
  "id": "",
  "email": "",
  "role": ""
}
```

---

# Membership APIs

## Get Membership Plans

Endpoint:

```text
GET /api/memberships/plans
```

Authorization:

Public

Purpose:

Retrieve available healthcare plans.

Response:

```json
[
  {
    "id": "",
    "name": "",
    "price": 0
  }
]
```

---

## Subscribe To Plan

Endpoint:

```text
POST /api/memberships/subscribe
```

Authorization:

Patient

Request:

```json
{
  "planId": ""
}
```

Validation:

- Plan must exist.

Response:

```json
{
  "subscriptionId": "",
  "status": "ACTIVE"
}
```

---

## Get Active Membership

Endpoint:

```text
GET /api/memberships/current
```

Authorization:

Patient

Purpose:

Retrieve current active subscription.

---

# Doctor APIs

## Search Doctors

Endpoint:

```text
GET /api/doctors
```

Authorization:

Authenticated User

Query Parameters:

```text
specialization

hospital

availability

consultationType
```

Purpose:

Search healthcare providers.

Validation:

Only VERIFIED doctors returned.

---

## Get Doctor Profile

Endpoint:

```text
GET /api/doctors/:doctorId
```

Authorization:

Authenticated User

Purpose:

Retrieve doctor details.

Response Includes:

- Profile
- Specialization
- Reviews
- Availability

---

## Get Doctor Availability

Endpoint:

```text
GET /api/doctors/:doctorId/availability
```

Authorization:

Authenticated User

Purpose:

Retrieve available booking slots.

---

# Appointment APIs

## Create Appointment

Endpoint:

```text
POST /api/appointments
```

Authorization:

Patient

Request:

```json
{
  "doctorId": "",
  "hospitalId": "",
  "appointmentType": "PHYSICAL",
  "date": "",
  "startTime": "",
  "reason": ""
}
```

Validation:

- Membership active.
- Doctor verified.
- Slot available.

Response:

```json
{
  "appointmentId": "",
  "status": "PENDING"
}
```

---

## Get My Appointments

Endpoint:

```text
GET /api/appointments
```

Authorization:

Patient

Purpose:

Retrieve patient appointments.

---

## Get Appointment

Endpoint:

```text
GET /api/appointments/:appointmentId
```

Authorization:

Owner, Assigned Doctor, Admin

Purpose:

Retrieve appointment details.

---

## Cancel Appointment

Endpoint:

```text
PATCH /api/appointments/:appointmentId/cancel
```

Authorization:

Patient, Doctor, Admin

Purpose:

Cancel appointment.

---

## Reschedule Appointment

Endpoint:

```text
PATCH /api/appointments/:appointmentId/reschedule
```

Authorization:

Patient

Request:

```json
{
  "date": "",
  "time": ""
}
```

Validation:

- New slot available.

---

# Consultation APIs

## Create Consultation Room

Endpoint:

```text
POST /api/consultations/create-room
```

Authorization:

System Only

Purpose:

Generate Daily.co meeting room.

---

## Get Consultation

Endpoint:

```text
GET /api/consultations/:consultationId
```

Authorization:

Assigned Participants

Purpose:

Retrieve consultation details.

---

## Join Consultation

Endpoint:

```text
POST /api/consultations/:consultationId/join
```

Authorization:

Assigned Patient

Assigned Doctor

Purpose:

Generate secure meeting access token.

---

## Complete Consultation

Endpoint:

```text
PATCH /api/consultations/:consultationId/complete
```

Authorization:

Assigned Doctor

Request:

```json
{
  "diagnosis": "",
  "recommendations": "",
  "followUpRequired": true
}
```

Purpose:

Complete consultation and save notes.

---

# Review APIs

## Create Review

Endpoint:

```text
POST /api/reviews
```

Authorization:

Patient

Request:

```json
{
  "appointmentId": "",
  "rating": 5,
  "comment": ""
}
```

Validation:

- Appointment completed.
- Ownership verified.
- One review per appointment.

---

## Get Doctor Reviews

Endpoint:

```text
GET /api/doctors/:doctorId/reviews
```

Authorization:

Public

Purpose:

Retrieve doctor reviews.

---

# Notification APIs

## Get Notifications

Endpoint:

```text
GET /api/notifications
```

Authorization:

Authenticated User

Purpose:

Retrieve user notifications.

---

## Mark Notification Read

Endpoint:

```text
PATCH /api/notifications/:notificationId/read
```

Authorization:

Notification Owner

Purpose:

Mark notification as read.

---

# Upload APIs

## Upload Profile Image

Endpoint:

```text
POST /api/uploads/profile
```

Authorization:

Authenticated User

Purpose:

Upload profile image.

Validation:

- Allowed image types only.
- File size limits enforced.

Response:

```json
{
  "url": ""
}
```

---

## Upload Doctor Credential

Endpoint:

```text
POST /api/uploads/credentials
```

Authorization:

Doctor

Purpose:

Upload verification documents.

Validation:

- PDF or image formats only.

---

# Doctor Availability APIs

## Create Availability

Endpoint:

```text
POST /api/doctor/availability
```

Authorization:

Doctor

Request:

```json
{
  "dayOfWeek": 1,
  "startTime": "",
  "endTime": ""
}
```

Validation:

- No overlap.

---

## Update Availability

Endpoint:

```text
PATCH /api/doctor/availability/:availabilityId
```

Authorization:

Owner Doctor

---

## Delete Availability

Endpoint:

```text
DELETE /api/doctor/availability/:availabilityId
```

Authorization:

Owner Doctor

---

# Admin APIs

## Get Pending Doctors

Endpoint:

```text
GET /api/admin/doctors/pending
```

Authorization:

Admin

Purpose:

Retrieve doctors awaiting verification.

---

## Verify Doctor

Endpoint:

```text
PATCH /api/admin/doctors/:doctorId/verify
```

Authorization:

Admin

Purpose:

Approve doctor.

---

## Reject Doctor

Endpoint:

```text
PATCH /api/admin/doctors/:doctorId/reject
```

Authorization:

Admin

Purpose:

Reject verification.

---

## Get Users

Endpoint:

```text
GET /api/admin/users
```

Authorization:

Admin

Purpose:

Retrieve users.

---

## Create Membership Plan

Endpoint:

```text
POST /api/admin/membership-plans
```

Authorization:

Admin

Purpose:

Create healthcare plan.

---

## Update Membership Plan

Endpoint:

```text
PATCH /api/admin/membership-plans/:planId
```

Authorization:

Admin

---

# Analytics APIs

## Dashboard Metrics

Endpoint:

```text
GET /api/admin/analytics
```

Authorization:

Admin

Response:

```json
{
  "patients": 0,
  "doctors": 0,
  "appointments": 0,
  "consultations": 0,
  "activeMemberships": 0
}
```

---

# Security Rules

1. Every protected endpoint requires authentication.
2. Every mutation requires authorization.
3. Healthcare data requires ownership validation.
4. Consultation access is restricted to assigned participants.
5. Doctor verification requires admin permissions.
6. Membership validation occurs before appointment creation.
7. Sensitive data is never returned unless required.
8. Input validation is mandatory for all write operations.

---

# API Invariants

1. Responses follow a consistent structure.
2. Authentication precedes authorization.
3. Business rules are enforced server-side.
4. Ownership validation is mandatory.
5. Consultation APIs require assigned participants.
6. Only verified doctors may receive appointments.
7. Only active memberships may create appointments.
8. Every endpoint must be auditable.
9. Sensitive healthcare data must remain protected.
10. API contracts are the source of truth for backend implementation.

```

```
