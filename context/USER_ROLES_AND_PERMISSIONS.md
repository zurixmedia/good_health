# User Roles and Permissions

## Overview

GoodHealth uses Role-Based Access Control (RBAC).

Every authenticated account belongs to exactly one primary role.

Roles determine:

- Accessible routes
- Accessible resources
- Allowed actions
- Administrative privileges

Authorization must be enforced at:

- UI level
- Route level
- API level
- Server Action level
- Database mutation level

Frontend permissions alone are never sufficient.

---

# Roles

The platform supports three primary roles.

## Patient

Healthcare consumer.

Can subscribe to healthcare plans and receive healthcare services.

---

## Doctor

Healthcare provider.

Can provide physical and virtual healthcare services.

Requires verification before becoming active.

---

## Admin

Platform administrator.

Responsible for managing users, doctors, memberships, and platform operations.

---

# Access Matrix

| Resource             | Patient | Doctor | Admin |
| -------------------- | ------- | ------ | ----- |
| Public Website       | ✓       | ✓      | ✓     |
| Authentication Pages | ✓       | ✓      | ✓     |
| Patient Dashboard    | ✓       | ✗      | ✗     |
| Doctor Dashboard     | ✗       | ✓      | ✗     |
| Admin Dashboard      | ✗       | ✗      | ✓     |
| Membership Plans     | ✓       | ✗      | ✓     |
| Doctor Search        | ✓       | ✗      | ✓     |
| Doctor Verification  | ✗       | ✗      | ✓     |
| Video Consultations  | ✓       | ✓      | ✗     |
| Analytics            | ✗       | ✗      | ✓     |

---

# Patient Permissions

## Purpose

Allow patients to manage memberships and healthcare services.

---

## Profile Permissions

Patients may:

- View own profile
- Edit own profile
- Upload profile photo
- Update personal information

Patients may not:

- View other patient profiles
- Modify other patient profiles

---

## Membership Permissions

Patients may:

- View membership plans
- Purchase memberships
- Renew memberships
- View subscription history
- Cancel subscriptions

Patients may not:

- Create plans
- Edit plans
- Delete plans

---

## Doctor Discovery Permissions

Patients may:

- Search doctors
- Filter doctors
- View doctor profiles
- View doctor reviews
- View doctor availability

Patients may not:

- Edit doctor profiles
- Verify doctors

---

## Appointment Permissions

Patients may:

- Create appointments
- View own appointments
- Cancel own appointments
- Reschedule own appointments

Patients may not:

- Access other patient appointments
- Access unrelated doctor appointments

---

## Consultation Permissions

Patients may:

- Join assigned consultations
- View consultation history
- View consultation recommendations

Patients may not:

- Join unrelated consultations
- Access other patient consultations

---

## Review Permissions

Patients may:

- Create reviews
- Edit own reviews
- Delete own reviews

Patients may not:

- Edit other user reviews

---

## Notification Permissions

Patients may:

- View own notifications
- Mark notifications as read

Patients may not:

- View notifications belonging to others

---

# Doctor Permissions

## Purpose

Allow doctors to provide healthcare services.

---

## Profile Permissions

Doctors may:

- View own profile
- Edit own profile
- Upload credentials
- Upload certifications

Doctors may not:

- Modify other doctor profiles

---

## Availability Permissions

Doctors may:

- Create availability slots
- Update availability slots
- Delete availability slots

Doctors may not:

- Modify availability belonging to other doctors

---

## Appointment Permissions

Doctors may:

- View assigned appointments
- Confirm appointments
- Complete appointments
- Cancel appointments when necessary

Doctors may not:

- Access appointments belonging to other doctors

---

## Consultation Permissions

Doctors may:

- Join assigned consultations
- Record consultation notes
- Create follow-up recommendations
- Complete consultations

Doctors may not:

- Access consultations unrelated to their appointments

---

## Patient Data Permissions

Doctors may:

- View assigned patient information
- View consultation history related to assigned appointments

Doctors may not:

- Access unrelated patient healthcare information

---

## Review Permissions

Doctors may:

- View reviews related to their profile

Doctors may not:

- Edit reviews
- Delete reviews

---

# Admin Permissions

## Purpose

Allow platform oversight and management.

---

## User Management

Admins may:

- View users
- Suspend users
- Reactivate users

Admins may not:

- Impersonate users

---

## Doctor Management

Admins may:

- View doctors
- Verify doctors
- Reject verification requests
- Suspend doctors
- Restore doctors

---

## Membership Management

Admins may:

- Create membership plans
- Edit membership plans
- Deactivate membership plans

Admins may:

- View all subscriptions

---

## Appointment Management

Admins may:

- View appointments
- Resolve scheduling conflicts
- Cancel appointments

Admins may not:

- Participate in consultations

---

## Hospital Management

Admins may:

- Create hospitals
- Update hospitals
- Archive hospitals

---

## Specialization Management

Admins may:

- Create specializations
- Update specializations
- Remove specializations

---

## Analytics Permissions

Admins may:

- View user metrics
- View appointment metrics
- View membership metrics
- View revenue metrics

---

# Doctor Verification Permissions

## Verification States

PENDING

VERIFIED

REJECTED

SUSPENDED

---

## Rules

Only admins may:

- Verify doctors
- Reject applications
- Suspend doctors

Doctors may:

- Submit verification requests
- Upload credentials

Doctors may not:

- Self-verify

---

# Consultation Access Rules

## Virtual Consultation Access

Only the following users may access consultation rooms:

- Assigned patient
- Assigned doctor

Admins may view consultation metadata.

Admins may not join active consultations.

---

# Healthcare Data Privacy Rules

## Patient Records

Patients may access:

- Own healthcare information

Patients may not access:

- Other patient healthcare information

---

## Doctor Access

Doctors may access:

- Healthcare information connected to assigned appointments

Doctors may not access:

- Unrelated healthcare information

---

## Administrative Access

Admins may access:

- Operational records
- Platform records

Access to healthcare information should be limited to authorized operational purposes.

---

# Ownership Rules

## Resource Ownership

Ownership must be validated before any mutation.

Examples:

Patient may update:

- Own profile
- Own appointments
- Own reviews

Doctor may update:

- Own profile
- Own availability

Admin may update:

- Platform-managed resources

---

# Route Protection Rules

## Public Routes

Accessible without authentication.

Examples:

- Home
- About
- Services
- Pricing
- Login
- Register

---

## Protected Routes

Require authentication.

Examples:

- Dashboard
- Membership
- Appointments
- Consultations

---

## Role Restricted Routes

Require specific roles.

Examples:

Patient Routes:

/patient/\*

Doctor Routes:

/doctor/\*

Admin Routes:

/admin/\*

---

# Security Invariants

1. Every protected action requires authentication.
2. Every mutation requires authorization.
3. Patients may access only their own healthcare information.
4. Doctors may access only assigned healthcare information.
5. Only admins may verify doctors.
6. Only verified doctors may provide healthcare services.
7. Consultation rooms are restricted to assigned participants.
8. Membership management follows ownership rules.
9. Role checks must exist on both frontend and backend.
10. Authorization must never rely solely on UI restrictions.
11. Healthcare information must remain private.
12. Ownership validation is required before all updates and deletions.
