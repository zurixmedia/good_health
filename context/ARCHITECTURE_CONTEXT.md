# Architecture Context

## Stack

| Layer              | Technology               | Role                                      |
| ------------------ | ------------------------ | ----------------------------------------- |
| Framework          | Next.js 16 + TypeScript  | Full-stack web application                |
| UI                 | Tailwind CSS + shadcn/ui | UI components and styling                 |
| Authentication     | Clerk                    | User identity and route protection        |
| Database           | PostgreSQL               | Primary relational database               |
| ORM                | Prisma                   | Database access and schema management     |
| File Storage       | Vercel Blob              | Images, documents, uploads                |
| Video Consultation | Daily.co                 | Secure doctor-patient video consultations |
| Email              | Resend                   | Transactional emails and notifications    |
| State Management   | Zustand                  | Client-side state management              |
| Validation         | Zod                      | Runtime validation                        |
| Forms              | React Hook Form          | Form management                           |
| Analytics          | PostHog                  | Product analytics                         |
| Deployment         | Vercel                   | Application hosting                       |
| Payments           | Stripe                   | Subscription and membership payments      |
| Payments           | Paystack                 | Nigerian payment processing               |

---

# System Boundaries

## Public Application

Responsible for:

- Marketing pages
- Membership information
- Healthcare services
- Provider discovery
- Authentication entry points

Routes:

```text
/

/about

/services

/pricing

/contact

/doctors

/login

/register
```

---

## Patient Application

Responsible for:

- Patient dashboard
- Membership management
- Appointment management
- Consultation access
- Notifications
- Profile management

Routes:

```text
/patient/dashboard

/patient/appointments

/patient/consultations

/patient/profile

/patient/membership
```

---

## Doctor Application

Responsible for:

- Appointment management
- Availability management
- Consultation management
- Patient interactions
- Professional profile management

Routes:

```text
/doctor/dashboard

/doctor/appointments

/doctor/availability

/doctor/consultations

/doctor/profile
```

---

## Admin Application

Responsible for:

- Doctor verification
- User management
- Membership management
- Platform oversight
- Analytics

Routes:

```text
/admin/dashboard

/admin/doctors

/admin/patients

/admin/memberships

/admin/appointments

/admin/analytics
```

---

## API Layer

Location:

```text
app/api
```

Responsibilities:

- Input validation
- Authorization
- Business rule enforcement
- Database access
- External service communication

API routes should never contain UI logic.

---

## Shared Libraries

Location:

```text
lib
```

Responsibilities:

- Prisma client
- Clerk utilities
- Permission checks
- Validation schemas
- Helper functions
- Notification utilities

---

## Components

Location:

```text
components
```

Responsibilities:

- Reusable UI components
- Shared design patterns
- Layout components
- Form components

Business logic should not reside in UI components.

---

# Storage Model

## PostgreSQL

Stores structured business data.

Examples:

- Users
- Patients
- Doctors
- Memberships
- Appointments
- Consultations
- Reviews
- Notifications

---

## Vercel Blob

Stores uploaded files.

Examples:

```text
profiles/

documents/

certifications/

consultations/
```

Examples:

```text
profiles/user-id.jpg

certifications/doctor-id.pdf

consultations/appointment-id.pdf
```

Database records store only file URLs.

---

# Authentication Model

Authentication is handled through Clerk.

Every authenticated user has:

```text
User

Role

Permissions
```

Roles:

- Patient
- Doctor
- Admin

Unauthenticated users may only access public routes.

---

# Authorization Model

Authorization uses role-based access control.

Every protected action requires:

1. Authentication
2. Authorization
3. Ownership validation when applicable

Examples:

Patient may access:

- Own appointments
- Own consultations

Doctor may access:

- Assigned appointments
- Assigned patients

Admin may access:

- Platform resources

---

# Membership Model

Memberships control access to healthcare services.

Membership States:

- ACTIVE
- EXPIRED
- CANCELLED
- SUSPENDED

Only ACTIVE memberships may:

- Book appointments
- Schedule consultations

Membership validation occurs before appointment creation.

---

# Appointment Model

Appointments are the core business entity.

Appointment Types:

- PHYSICAL
- VIRTUAL

Appointment States:

- PENDING
- CONFIRMED
- COMPLETED
- CANCELLED
- NO_SHOW

Every appointment belongs to:

- One patient
- One doctor

Physical appointments require a hospital location.

Virtual appointments require a consultation room.

---

# Video Consultation Model

Virtual healthcare services are delivered through Daily.co.

Consultation lifecycle:

1. Appointment scheduled
2. Meeting room generated
3. Participants join
4. Consultation conducted
5. Notes recorded
6. Consultation completed

Only assigned participants may join.

---

# Notification Model

Notifications are generated for platform events.

Examples:

- Membership activated
- Membership expired
- Appointment booked
- Appointment confirmed
- Appointment cancelled
- Consultation reminder

Delivery Channels:

- In-App
- Email

---

# Search Model

Patients can discover providers through search.

Supported filters:

- Specialization
- Hospital
- Consultation Type
- Availability

Search results should only include verified doctors.

---

# Doctor Verification Model

Doctor accounts require administrative verification.

States:

- PENDING
- VERIFIED
- REJECTED
- SUSPENDED

Only VERIFIED doctors may:

- Accept appointments
- Appear in search results
- Conduct consultations

---

# Security Model

Healthcare data is sensitive.

Requirements:

- Secure authentication
- Protected routes
- Ownership validation
- Server-side authorization
- Input validation
- Secure file access

Authorization must never rely solely on frontend validation.

---

# Error Handling Model

All failures should produce:

- User-friendly messages
- Consistent error structures
- Recoverable user actions where possible

System errors should be logged.

Sensitive information must never be exposed to users.

---

# Deployment Model

Frontend:

Vercel

Database:

PostgreSQL

Storage:

Vercel Blob

Authentication:

Clerk

Video Consultations:

Daily.co

Email:

Resend

---

# Invariants

1. Every appointment belongs to one patient and one doctor.
2. Only verified doctors may provide healthcare services.
3. Only active memberships may access healthcare services.
4. Doctors cannot be double-booked.
5. Virtual consultations require valid meeting rooms.
6. Physical appointments require hospital locations.
7. Every protected action requires authentication.
8. Every mutation requires authorization.
9. Healthcare data must remain private.
10. Business rules are enforced on the server.

## Healthcare Specializations

The platform supports multiple healthcare specialties.

Examples:

- Cardiology
- Dentistry
- Pediatrics
- Dermatology
- Orthopedics
- Optometry

Additional specializations may be added by administrators.

## Healthcare Providers

Healthcare services are provided through verified hospitals and healthcare professionals.

Doctors may be associated with one or more healthcare facilities.

Physical appointments occur at registered healthcare facilities.

## Audit Logging

Important platform actions should be logged.

Examples:

- Doctor verification
- Membership activation
- Appointment cancellation
- Consultation completion

Audit records are immutable.
