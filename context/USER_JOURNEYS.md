# User Journeys

## Overview

This document defines the primary end-to-end user journeys within GoodHealth.

User journeys describe how real users move through the platform to achieve goals.

These flows should be considered the preferred experience when implementing features.

---

# Journey 1: New Patient Registration

## Goal

Create a patient account and gain access to healthcare services.

### Steps

1. User visits GoodHealth.
2. User selects Sign Up.
3. User chooses Patient Account.
4. User enters registration details.
5. User verifies account.
6. User profile is created.
7. User is redirected to onboarding.
8. User is prompted to select a membership plan.

### Success Outcome

Patient account created successfully.

---

# Journey 2: Membership Purchase

## Goal

Activate healthcare access through a membership plan.

### Preconditions

- User is authenticated.
- User has a patient account.

### Steps

1. Patient views membership plans.
2. Patient compares available plans.
3. Patient selects a plan.
4. Patient reviews plan details.
5. Patient proceeds to payment.
6. Payment is processed.
7. Membership subscription is activated.
8. Confirmation notification is sent.

### Success Outcome

Membership status becomes ACTIVE.

---

# Journey 3: Doctor Discovery

## Goal

Find an appropriate healthcare provider.

### Preconditions

- Patient has active membership.

### Steps

1. Patient opens Doctors page.
2. Patient searches providers.
3. Patient applies filters.
4. System returns matching doctors.
5. Patient reviews doctor profiles.
6. Patient selects a doctor.

### Success Outcome

Doctor selected for appointment booking.

---

# Journey 4: Physical Appointment Booking

## Goal

Book an in-person hospital appointment.

### Preconditions

- Active membership.
- Verified doctor available.

### Steps

1. Patient selects doctor.
2. Patient selects Physical Appointment.
3. Patient selects hospital location.
4. Patient selects date.
5. Patient selects available time slot.
6. Patient enters reason for visit.
7. System validates availability.
8. Appointment created.
9. Confirmation notification sent.

### Success Outcome

Physical appointment scheduled.

---

# Journey 5: Virtual Consultation Booking

## Goal

Book an online healthcare consultation.

### Preconditions

- Active membership.
- Doctor supports virtual consultations.

### Steps

1. Patient selects doctor.
2. Patient selects Virtual Consultation.
3. Patient selects available slot.
4. Patient enters consultation reason.
5. Appointment created.
6. Consultation room generated.
7. Meeting details provided.
8. Confirmation notification sent.

### Success Outcome

Virtual consultation scheduled.

---

# Journey 6: Attend Virtual Consultation

## Goal

Receive healthcare services remotely.

### Preconditions

- Scheduled virtual consultation.

### Steps

1. Consultation reminder received.
2. Patient opens consultation.
3. Patient joins meeting room.
4. Doctor joins meeting room.
5. Consultation takes place.
6. Doctor records notes.
7. Consultation completed.

### Success Outcome

Consultation completed successfully.

---

# Journey 7: Follow-Up Recommendation

## Goal

Transition from virtual care to physical care when required.

### Preconditions

- Completed virtual consultation.

### Steps

1. Doctor completes consultation.
2. Doctor recommends physical visit.
3. Recommendation saved.
4. Patient receives notification.
5. Patient reviews recommendation.
6. Patient books physical appointment.

### Success Outcome

Follow-up appointment scheduled.

---

# Journey 8: Membership Renewal

## Goal

Maintain uninterrupted healthcare access.

### Preconditions

- Existing membership.

### Steps

1. Membership approaches expiration.
2. Reminder notification sent.
3. Patient reviews membership.
4. Patient renews subscription.
5. Payment processed.
6. Membership extended.

### Success Outcome

Membership remains ACTIVE.

---

# Journey 9: Doctor Onboarding

## Goal

Become an approved healthcare provider.

### Steps

1. Doctor registers account.
2. Doctor completes profile.
3. Doctor uploads credentials.
4. Doctor submits verification request.
5. Status becomes PENDING.
6. Admin reviews submission.
7. Verification approved.

### Success Outcome

Doctor status becomes VERIFIED.

---

# Journey 10: Doctor Availability Setup

## Goal

Make appointment slots available.

### Preconditions

- Verified doctor.

### Steps

1. Doctor opens availability settings.
2. Doctor creates schedule.
3. Doctor selects days.
4. Doctor selects working hours.
5. Availability saved.

### Success Outcome

Patients can book appointments.

---

# Journey 11: Doctor Daily Workflow

## Goal

Manage patient appointments efficiently.

### Steps

1. Doctor signs in.
2. Doctor views dashboard.
3. Doctor reviews today's appointments.
4. Doctor conducts consultations.
5. Doctor records consultation notes.
6. Doctor updates appointment status.
7. Doctor reviews upcoming schedule.

### Success Outcome

Appointments managed successfully.

---

# Journey 12: Admin Doctor Verification

## Goal

Ensure healthcare provider quality.

### Steps

1. Admin reviews pending requests.
2. Admin views credentials.
3. Admin validates information.
4. Admin approves or rejects application.
5. Doctor notified of decision.

### Success Outcome

Verification status updated.

---

# Journey 13: Review Submission

## Goal

Allow patients to provide feedback.

### Preconditions

- Completed appointment.

### Steps

1. Patient opens completed appointment.
2. Patient submits rating.
3. Patient writes review.
4. Validation runs.
5. Review saved.

### Success Outcome

Review published.

---

# Journey 14: Notification Management

## Goal

Keep users informed.

### Steps

1. User receives notification.
2. User opens notification center.
3. User views details.
4. Notification marked as read.

### Success Outcome

User remains informed of important events.

---

# Journey Dependencies

Patient Registration
↓
Membership Purchase
↓
Doctor Discovery
↓
Appointment Booking
↓
Consultation
↓
Follow-Up
↓
Review

Doctor Registration
↓
Verification
↓
Availability Setup
↓
Appointment Management
↓
Consultation Management

Admin Verification
↓
Doctor Approval
↓
Provider Discovery

---

# Journey Invariants

1. Membership purchase occurs before appointment booking.
2. Appointment booking occurs before consultations.
3. Consultations occur before follow-up recommendations.
4. Reviews require completed appointments.
5. Doctors must be verified before appearing in search results.
6. Availability must exist before appointments can be booked.
7. Payments must succeed before memberships become active.
8. Every journey must respect authorization rules.
9. Every journey must respect business rules.
10. Every journey must support desktop and mobile users.
