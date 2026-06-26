# UI / UX Guidelines

## Overview

This document defines the user experience, visual design principles, component standards, accessibility requirements, and responsive behavior for GoodHealth.

Figma designs are the visual source of truth.

This document defines the rules that govern implementation.

All interfaces should prioritize:

- Clarity
- Accessibility
- Trust
- Simplicity
- Professionalism
- Healthcare credibility

Users should be able to complete healthcare-related tasks with minimal friction.

---

# Design Principles

## Trust First

Healthcare platforms must inspire confidence.

Interfaces should feel:

- Professional
- Clean
- Reliable
- Secure

Avoid:

- Excessive animations
- Flashy effects
- Distracting visuals

---

## Simplicity

Users should never feel overwhelmed.

Complex healthcare workflows should be broken into clear steps.

Examples:

- Membership purchase
- Appointment booking
- Consultation scheduling

---

## Consistency

The same interaction should behave the same way throughout the platform.

Examples:

- Buttons
- Forms
- Cards
- Search
- Filters
- Modals

---

## Accessibility

Interfaces should be usable by users of all ages and technical abilities.

Healthcare services must remain accessible.

---

# Design System

## Typography

### Font Family

Primary Font:

Inter

Fallback:

sans-serif

---

### Heading Scale

H1

Used for:

- Hero sections
- Major page titles

Large and prominent.

---

H2

Used for:

- Section titles
- Dashboard sections

---

H3

Used for:

- Card titles
- Widget titles

---

Body

Used for:

- Descriptions
- Paragraphs
- General content

---

Caption

Used for:

- Metadata
- Timestamps
- Supporting information

---

# Color System

## Brand Colors

Colors should communicate healthcare trust and safety.

Primary:

Healthcare Blue

Secondary:

Healthcare Green

Neutral:

White
Gray Scale

---

## Semantic Colors

Success

Used for:

- Completed appointments
- Active memberships
- Successful actions

---

Warning

Used for:

- Expiring memberships
- Pending verification

---

Error

Used for:

- Validation failures
- Failed actions
- Cancelled states

---

Info

Used for:

- Notifications
- Guidance
- Educational content

---

# Spacing System

Use an 8-point spacing system.

Allowed spacing values:

8
16
24
32
40
48
64
80

Avoid arbitrary spacing values.

---

# Layout Rules

## Maximum Content Width

Content should remain readable on large displays.

Primary content areas should use a constrained width.

---

## Page Structure

Every page should follow:

Header

↓

Main Content

↓

Footer

Where applicable.

---

## Dashboard Structure

Dashboard pages should follow:

Top Navigation

↓

Page Header

↓

Key Metrics

↓

Primary Actions

↓

Supporting Content

---

## Card-Based Layouts

Healthcare information should be grouped using cards.

Examples:

- Membership cards
- Doctor cards
- Appointment cards
- Statistics cards

---

# Navigation Standards

## Primary Navigation

Primary navigation should remain visible.

Users should always know:

- Where they are
- Where they can go

---

## Dashboard Navigation

Dashboard navigation should support:

- Desktop Sidebar
- Mobile Drawer

---

## Active States

Current routes should always be visually identifiable.

---

# Forms

## General Rules

Forms should be simple and predictable.

---

## Labels

Every input requires a visible label.

Placeholders should not replace labels.

---

## Validation

Validation should occur:

- On submit
- On field interaction where appropriate

---

## Error Messages

Errors should:

- Be specific
- Explain the issue
- Suggest correction

Example:

Good:

Email address is required.

Bad:

Invalid input.

---

## Required Fields

Required fields must be clearly indicated.

---

# Buttons

## Primary Buttons

Used for:

- Important actions
- Form submissions
- Confirmations

Examples:

- Book Appointment
- Join Consultation
- Subscribe

---

## Secondary Buttons

Used for:

- Supporting actions

Examples:

- Cancel
- Back
- View Details

---

## Destructive Buttons

Used only for:

- Delete
- Cancel Subscription
- Remove Records

Require confirmation.

---

# Tables

Used primarily within:

- Admin Dashboard
- Doctor Dashboard

Requirements:

- Sorting
- Pagination
- Search
- Responsive behavior

---

# Search Experience

Search should support:

- Instant feedback
- Filtering
- Empty states

---

## Search Filters

Examples:

- Specialization
- Hospital
- Availability
- Consultation Type

---

# Appointment Experience

Appointment workflows should feel guided.

Steps:

Select Doctor

↓

Select Type

↓

Select Date

↓

Select Time

↓

Confirm

Avoid overwhelming users with too many choices simultaneously.

---

# Consultation Experience

Virtual consultations should prioritize simplicity.

Users should always see:

- Appointment details
- Join button
- Consultation status

---

## Consultation States

Scheduled

Active

Completed

Missed

States should be visually distinct.

---

# Notifications

Notifications should be:

- Easy to understand
- Actionable
- Dismissible

---

# Empty States

Every empty state should guide users toward action.

Examples:

No appointments yet.

Book your first appointment.

---

No active membership.

Choose a healthcare plan to begin.

---

# Loading States

Every async action should display feedback.

Examples:

- Skeleton loaders
- Progress indicators
- Loading spinners

Avoid blank screens.

---

# Error States

Error screens should:

- Explain the issue
- Suggest next steps
- Provide recovery actions

---

# Accessibility Standards

## Keyboard Navigation

All interactive elements must support keyboard access.

---

## Focus States

Focusable elements must display visible focus indicators.

---

## Screen Reader Support

Interactive elements require:

- Proper labels
- ARIA attributes when necessary

---

## Color Accessibility

Color alone must never communicate information.

Examples:

Bad:

Red means error.

Good:

Red color + icon + text.

---

## Contrast

Text must maintain sufficient contrast.

---

# Responsive Design

## Mobile First

All interfaces should be designed mobile-first.

---

## Supported Breakpoints

Mobile

Tablet

Desktop

Large Desktop

---

## Mobile Requirements

All major features must work on mobile.

Examples:

- Membership management
- Appointment booking
- Video consultations

---

## Tablet Requirements

Layouts should adapt gracefully.

Avoid desktop-only assumptions.

---

## Desktop Requirements

Take advantage of larger screen space while maintaining readability.

---

# Component Standards

## Cards

Used for:

- Doctors
- Memberships
- Appointments
- Analytics

Cards should maintain consistent styling.

---

## Modals

Used for:

- Confirmations
- Secondary workflows

Avoid large multi-step processes inside modals.

---

## Drawers

Preferred on mobile for:

- Navigation
- Filters

---

## Dropdowns

Used for:

- Selections
- Actions

Avoid excessive nesting.

---

## Badges

Used for status representation.

Examples:

ACTIVE

PENDING

COMPLETED

VERIFIED

---

## Avatars

Used for:

- Patients
- Doctors
- Admins

Fallbacks required.

---

# Trust Signals

Healthcare users must feel safe.

Display where applicable:

- Verified Doctor badges
- Hospital affiliations
- Ratings and reviews
- Membership status
- Secure consultation indicators

---

# Performance Guidelines

Interfaces should feel responsive.

Avoid:

- Large unnecessary animations
- Excessive re-renders
- Heavy client-side computation

---

# UX Invariants

1. Healthcare tasks should require the fewest possible steps.
2. Users should always understand the next action.
3. Important actions must have confirmation feedback.
4. Forms must provide clear validation.
5. Mobile experience is equal in importance to desktop.
6. Accessibility is mandatory.
7. Loading states must always be visible.
8. Empty states must guide users toward action.
9. Trust and clarity take precedence over visual complexity.
10. Figma designs remain the visual source of truth.
