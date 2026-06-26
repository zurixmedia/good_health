# Business Rules

## Overview

Business rules define the operational constraints and requirements of the GoodHealth platform.

These rules must be enforced consistently across:

- Database operations
- API routes
- Server actions
- Background jobs
- User interfaces

Business rules take precedence over UI behavior and implementation details.

---

# Membership Rules

## Membership Requirement

A patient must have an active membership before accessing healthcare services.

### Rule

Patients without an active membership cannot:

- Book appointments
- Schedule virtual consultations
- Access membership-only healthcare services

---

## Membership Status

A membership may be:

- ACTIVE
- EXPIRED
- CANCELLED
- SUSPENDED

### Rule

Only ACTIVE memberships can access healthcare services.

---

## Membership Expiration

### Rule

Expired memberships lose healthcare access until renewed.

---

## Membership Ownership

### Rule

A membership belongs to exactly one account holder.

Family plans may include additional members according to plan limits.

---

# Doctor Rules

## Verification Requirement

Doctors must be verified before providing services.

### Rule

Only VERIFIED doctors may:

- Receive appointments
- Appear in doctor search results
- Conduct consultations

---

## Doctor Availability

### Rule

Appointments can only be scheduled during available doctor time slots.

---

## Double Booking Prevention

### Rule

A doctor cannot have overlapping appointments.

A doctor cannot be assigned to two appointments at the same date and time.

---

## Suspension

### Rule

Suspended doctors cannot:

- Accept appointments
- Conduct consultations
- Appear in search results

---

# Appointment Rules

## Appointment Ownership

### Rule

Every appointment must belong to:

- One patient
- One doctor

---

## Future Scheduling

### Rule

Appointments must be scheduled in the future.

Past dates cannot be booked.

---

## Slot Availability

### Rule

Appointments may only be booked into available time slots.

---

## Physical Appointment Requirement

### Rule

Physical appointments must be linked to a hospital location.

---

## Appointment Statuses

Allowed statuses:

- PENDING
- CONFIRMED
- COMPLETED
- CANCELLED
- NO_SHOW

### Rule

Status transitions must be valid.

Example:

PENDING → CONFIRMED

CONFIRMED → COMPLETED

CONFIRMED → CANCELLED

Invalid transitions are not allowed.

---

## Rescheduling

### Rule

Rescheduled appointments must be assigned a new valid slot.

The new slot must pass availability validation.

---

# Virtual Consultation Rules

## Consultation Requirement

### Rule

Every virtual consultation must be linked to an appointment.

---

## Meeting Room Requirement

### Rule

Virtual consultations must have a valid meeting room.

Examples:

- Daily.co
- Zoom
- Google Meet

---

## Participant Access

### Rule

Only assigned participants may join a consultation.

Allowed participants:

- Assigned patient
- Assigned doctor

---

## Consultation Completion

### Rule

Consultation records must be saved before a consultation can be marked completed.

---

# Follow-Up Rules

## Follow-Up Recommendation

### Rule

Doctors may recommend a physical appointment after a virtual consultation.

---

## Follow-Up Ownership

### Rule

Follow-up recommendations belong to the patient associated with the consultation.

---

# Review Rules

## Review Eligibility

### Rule

Patients may only review completed appointments.

---

## Review Ownership

### Rule

Patients may only review appointments they attended.

---

## Review Limit

### Rule

One review is allowed per appointment.

---

# Notification Rules

## Notification Ownership

### Rule

Users may only access their own notifications.

---

## Appointment Notifications

Notifications must be generated for:

- Appointment creation
- Appointment confirmation
- Appointment cancellation
- Appointment rescheduling

---

## Consultation Notifications

Notifications must be generated for:

- Consultation scheduled
- Consultation reminder
- Consultation completed

---

# Healthcare Data Rules

## Data Privacy

### Rule

Healthcare information must only be accessible by authorized users.

---

## Patient Access

Patients may only access:

- Their own profile
- Their own appointments
- Their own consultation history

---

## Doctor Access

Doctors may only access healthcare information related to assigned appointments.

---

## Administrative Access

Administrators may access healthcare records only according to platform authorization policies.

---

# Security Rules

## Authentication

### Rule

Every protected action requires authentication.

---

## Authorization

### Rule

Every protected action requires authorization checks.

---

## Ownership Validation

### Rule

Resource ownership must be verified before mutations occur.

---

# System Rules

## Auditability

### Rule

Important actions should be traceable.

Examples:

- Appointment creation
- Appointment cancellation
- Doctor verification
- Membership activation

---

## Consistency

### Rule

Business rules must be enforced at the backend.

Frontend validation alone is not sufficient.

---

# Invariants

1. Every appointment belongs to one patient and one doctor.
2. Doctors cannot be double-booked.
3. Only verified doctors can provide services.
4. Only active memberships can access healthcare services.
5. Virtual consultations require valid meeting rooms.
6. Reviews require completed appointments.
7. Patients can only access their own healthcare records.
8. Every protected action requires authentication.
9. Every mutation requires authorization.
10. Business rules are enforced on the server.

## Subscription Renewal

Expired subscriptions may be renewed.

Renewed subscriptions regain healthcare access immediately after successful payment.

## Consultation Follow-Up

Doctors may recommend physical appointments after virtual consultations.

Follow-up appointments should be linked to the originating consultation when applicable.

## No Show Policy

Appointments may be marked NO_SHOW when:

- Patient fails to attend.
- Doctor fails to attend.

No-show actions must be auditable.
