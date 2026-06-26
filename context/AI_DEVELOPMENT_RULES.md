# AI Development Rules

## Overview

This document defines the implementation rules that all AI agents, developers, and contributors must follow when building GoodHealth.

These rules exist to ensure:

- Consistency
- Scalability
- Maintainability
- Security
- Predictable architecture

All implementation decisions must follow these rules unless explicitly overridden.

---

# Project Sources of Truth

The following documents define the system.

Priority Order:

1. PROJECT_OVERVIEW.md
2. BUSINESS_RULES.md
3. ARCHITECTURE_CONTEXT.md
4. DATABASE_SCHEMA.md
5. FEATURE_SPECIFICATIONS.md
6. USER_JOURNEYS.md
7. USER_ROLES_AND_PERMISSIONS.md
8. UI_UX_GUIDELINES.md
9. FIGMA_REFERENCE.md
10. API_CONTRACTS.md

If conflicts exist:

Higher priority documents win.

---

# General Development Rules

## Rule 1

Never invent requirements.

Only implement documented requirements.

If information is missing:

Request clarification.

Do not assume.

---

## Rule 2

Prefer reusable solutions.

Before creating new code:

Check for existing:

- Components
- Hooks
- Utilities
- Services
- Types

Avoid duplication.

---

## Rule 3

Business rules must never exist only in the UI.

All critical validation belongs on the server.

Examples:

- Membership validation
- Appointment validation
- Authorization
- Ownership checks

---

## Rule 4

Use TypeScript strictly.

Avoid:

- any
- implicit types
- untyped API responses

Strong typing is required.

---

# Architecture Rules

## Next.js App Router

Use:

- Server Components by default
- Client Components only when necessary

Client Components are allowed only for:

- Forms
- Interactive UI
- Real-time state
- Browser APIs

Everything else should remain server-side.

---

## Folder Responsibilities

app/

Routing and pages only.

---

components/

Reusable UI components only.

No business logic.

---

lib/

Shared infrastructure.

Examples:

- database
- auth
- permissions
- utilities

---

actions/

Server Actions.

Business operations.

---

prisma/

Database schema.

---

types/

Shared TypeScript types.

---

# Database Rules

## Prisma Is Source Of Truth

Database structure must originate from:

DATABASE_SCHEMA.md

Never create undocumented tables.

Never create undocumented relationships.

---

## Migrations

Every schema change requires migration.

Never manually modify production tables.

---

## Queries

Use Prisma.

Avoid raw SQL unless absolutely necessary.

---

# API Rules

## Follow API Contracts

API_CONTRACTS.md is authoritative.

Endpoints must not be invented.

---

## Validation

Every write operation requires validation.

Use:

Zod

for request validation.

---

## Response Format

Success:

```ts
{
  success: true,
  data: {}
}
```

Error:

```ts
{
  success: false,
  error: {
    message: ""
  }
}
```

All endpoints must follow this format.

---

# Authentication Rules

## Clerk Is Source Of Identity

User identity must come from Clerk.

Never trust client-provided user IDs.

Always derive identity from authenticated session.

---

## Route Protection

Protected routes require authentication.

Role-restricted routes require authorization.

---

# Authorization Rules

Always verify:

1. Authentication
2. Role
3. Ownership

Before performing mutations.

---

Example:

Patient can modify:

Own appointment

Not another patient's appointment.

---

# Healthcare Privacy Rules

Healthcare data is sensitive.

Apply least-privilege access.

---

Patients may access:

Own healthcare information.

---

Doctors may access:

Assigned patient information only.

---

Admins may access:

Operational platform data.

---

Never expose healthcare information unnecessarily.

---

# Appointment Rules

Before appointment creation:

Verify:

- Active membership
- Verified doctor
- Available slot

All three conditions are mandatory.

---

Prevent:

- Double booking
- Overlapping appointments

---

# Consultation Rules

Consultation access is restricted to:

- Assigned patient
- Assigned doctor

No other users may join.

---

Consultation notes must persist after completion.

---

# File Upload Rules

Uploads must be validated.

Validate:

- File type
- File size

Before storage.

---

Never trust client metadata.

---

# UI Implementation Rules

## Figma First

FIGMA_REFERENCE.md is the visual source of truth.

Do not redesign screens.

Implement existing designs.

---

## Design System

Follow:

UI_UX_GUIDELINES.md

for:

- Typography
- Spacing
- Colors
- Components

---

## Component Reuse

Shared UI must be extracted.

Examples:

- DoctorCard
- AppointmentCard
- MembershipCard
- StatusBadge

Avoid duplicate implementations.

---

# Accessibility Rules

Every feature must support:

- Keyboard navigation
- Focus states
- Screen readers
- Responsive layouts

Accessibility is not optional.

---

# Responsive Rules

Mobile-first implementation required.

Support:

- Mobile
- Tablet
- Desktop

All core workflows must work on mobile.

---

# State Management Rules

Prefer:

1. Server Components
2. Server Actions
3. URL State

Before introducing client state.

Use React state only when necessary.

Avoid unnecessary global state.

---

# Error Handling Rules

Every async operation must handle:

- Loading state
- Error state
- Empty state

Blank screens are prohibited.

---

# Logging Rules

Important events must be logged.

Examples:

- Membership activated
- Appointment booked
- Consultation completed
- Doctor verified

---

# Testing Rules

Critical flows require testing.

Priority flows:

1. Registration
2. Membership Purchase
3. Appointment Booking
4. Consultation Join
5. Doctor Verification

---

# Performance Rules

Avoid unnecessary client-side rendering.

Prefer:

- Server Components
- Pagination
- Lazy loading

Optimize for responsiveness.

---

# Code Quality Rules

Functions should have a single responsibility.

Avoid large files.

Prefer composition over complexity.

---

## Naming Conventions

Components:

PascalCase

Example:

DoctorCard.tsx

---

Hooks:

camelCase

Example:

useAppointments.ts

---

Server Actions:

Verb-first naming.

Example:

createAppointment()

cancelAppointment()

verifyDoctor()

---

# Documentation Rules

Every major module should contain:

- Purpose
- Inputs
- Outputs

Complex logic requires comments.

---

# AI Generation Rules

Before generating code:

1. Check architecture.
2. Check database schema.
3. Check API contracts.
4. Check permissions.
5. Check business rules.
6. Check Figma references.

Never generate code without validating against project context.

---

# Non-Negotiable Invariants

1. Membership must be active before booking appointments.
2. Only verified doctors may receive appointments.
3. Authorization is enforced server-side.
4. Healthcare information remains private.
5. Figma is the visual source of truth.
6. API contracts are the backend source of truth.
7. Prisma schema is the database source of truth.
8. Business rules override UI behavior.
9. Accessibility is mandatory.
10. Mobile-first design is required.
11. Reusable components are preferred.
12. Type safety is mandatory.
13. Every mutation requires authorization.
14. Every endpoint requires validation.
15. Security takes precedence over convenience.

```

```

a
