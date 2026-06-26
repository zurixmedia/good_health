# Figma Reference

## Overview

This document maps all GoodHealth Figma designs to implementation.

Figma is the visual source of truth.

All screens listed below exist in both:

- Desktop
- Mobile

Unless otherwise specified.

---

# Marketing Website

## Landing Page

Purpose:

Introduce GoodHealth and encourage membership sign-up.

Desktop Design:

```text
figma/homepage/desktop.png
```

Mobile Design:

```text
figma/homepage/mobile.png
```

Contains:

- Hero Section
- Healthcare Services
- Specializations
- Doctors Preview
- Membership Plans
- Testimonials
- FAQ
- Footer

---

# Authentication

## Sign In

Desktop Design:

```text
figma/auth/signin-desktop.png
```

Mobile Design:

```text
figma/auth/signin-mobile.png
```

Contains:

- Email
- Password
- Remember Me
- Forgot Password

---

## Sign Up

Desktop Design:

```text
figma/auth/signup-desktop
```

Mobile Design:

```text
figma/auth/signup-mobile
```

Contains:

- Patient Registration
- Doctor Registration
- Validation States

---

# Patient Application

## Patient Dashboard

Desktop Design:

```text
figma/patient/dashboard-desktop
```

Mobile Design:

```text
figma/patient/dashboard-mobile
```

Contains:

- Membership Status
- Upcoming Appointments
- Quick Actions
- Notifications

---

## Doctor Search

Desktop Design:

```text
figma/patient/search-doctors-desktop
```

Mobile Design:

```text
figma/patient/search-doctors-mobile
```

Contains:

- Search
- Filters
- Doctor Cards

---

## Doctor Profile

Desktop Design:

```text
figma/patient/doctor-profile-desktop
```

Mobile Design:

```text
figma/patient/doctor-profile-mobile
```

Contains:

- Doctor Information
- Reviews
- Availability
- Book Appointment CTA

---

## Appointment Booking

Desktop Design:

```text
figma/patient/book-appointment-desktop
```

Mobile Design:

```text
figma/patient/book-appointment-mobile
```

Contains:

- Appointment Type
- Date Selection
- Time Selection
- Confirmation

---

## Patient Appointments

Desktop Design:

```text
figma/patient/appointments-desktop
```

Mobile Design:

```text
figma/patient/appointments-mobile
```

Contains:

- Upcoming Appointments
- Past Appointments
- Appointment Status

---

## Video Consultation

Desktop Design:

```text
figma/patient/consultation-desktop
```

Mobile Design:

```text
figma/patient/consultation-mobile
```

Contains:

- Video Interface
- Consultation Details
- Chat
- Notes

---

## Membership Management

Desktop Design:

```text
figma/patient/membership-desktop
```

Mobile Design:

```text
figma/patient/membership-mobile
```

Contains:

- Current Plan
- Billing
- Renewal

---

## Profile

Desktop Design:

```text
figma/patient/profile-desktop
```

Mobile Design:

```text
figma/patient/profile-mobile
```

---

# Doctor Application

## Doctor Dashboard

Desktop Design:

```text
figma/doctor/dashboard-desktop
```

Mobile Design:

```text
figma/doctor/dashboard-mobile
```

Contains:

- Today's Schedule
- Upcoming Appointments
- Consultation Queue

---

## Availability Management

Desktop Design:

```text
figma/doctor/availability-desktop
```

Mobile Design:

```text
figma/doctor/availability-mobile
```

Contains:

- Calendar
- Working Hours
- Slot Management

---

## Doctor Appointments

Desktop Design:

```text
figma/doctor/appointments-desktop
```

Mobile Design:

```text
figma/doctor/appointments-mobile
```

Contains:

- Upcoming Appointments
- Appointment Actions
- Status Updates

---

## Consultation Room

Desktop Design:

```text
figma/doctor/consultation-desktop
```

Mobile Design:

```text
figma/doctor/consultation-mobile
```

Contains:

- Video Interface
- Consultation Notes
- Follow-Up Recommendation

---

## Patient Information

Desktop Design:

```text
figma/doctor/patient-details-desktop
```

Mobile Design:

```text
figma/doctor/patient-details-mobile
```

Contains:

- Patient Profile
- Appointment History
- Consultation Notes

---

## Doctor Profile

Desktop Design:

```text
figma/doctor/profile-desktop
```

Mobile Design:

```text
figma/doctor/profile-mobile
```

---

# Design Invariants

1. All listed screens have desktop and mobile versions.
2. Desktop and mobile designs are implementation references.
3. Figma is the visual source of truth.
4. UI_UX_GUIDELINES.md governs behavior and accessibility.
5. New screens must follow existing design patterns.
6. No screen should be redesigned during implementation.
7. Shared components should be extracted whenever possible.
