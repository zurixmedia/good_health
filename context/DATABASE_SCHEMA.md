# Database Schema Context

## Database

PostgreSQL

Managed through Prisma ORM.

The database stores structured business data and relationships.

Large files and uploaded assets are stored in Vercel Blob and referenced by URL.

---

# Enums

## UserRole

PATIENT

DOCTOR

ADMIN

---

## MembershipStatus

ACTIVE

EXPIRED

CANCELLED

SUSPENDED

---

## DoctorVerificationStatus

PENDING

VERIFIED

REJECTED

SUSPENDED

---

## AppointmentType

PHYSICAL

VIRTUAL

---

## AppointmentStatus

PENDING

CONFIRMED

COMPLETED

CANCELLED

NO_SHOW

---

## ConsultationStatus

SCHEDULED

ACTIVE

COMPLETED

MISSED

---

## NotificationType

APPOINTMENT

CONSULTATION

MEMBERSHIP

SYSTEM

---

# User

Represents every authenticated account.

Authentication is handled through Clerk.

## Fields

- id
- clerkId
- email
- firstName
- lastName
- phoneNumber
- role
- profileImageUrl
- isActive
- createdAt
- updatedAt

## Relationships

- Has One PatientProfile
- Has One DoctorProfile
- Has Many Notifications
- Has Many AuditLogs
- Has Many FileUploads

---

# PatientProfile

Stores patient-specific information.

## Fields

- id
- userId
- dateOfBirth
- gender
- address
- emergencyContactName
- emergencyContactPhone
- bloodGroup
- createdAt
- updatedAt

## Relationships

- Belongs To User
- Has Many MembershipSubscriptions
- Has Many Appointments
- Has Many Reviews

---

# DoctorProfile

Stores doctor-specific information.

## Fields

- id
- userId
- specializationId
- verificationStatus
- licenseNumber
- yearsOfExperience
- bio
- consultationFee
- supportsVirtualConsultation
- profileCompleted
- verificationDocumentUrl
- createdAt
- updatedAt

## Relationships

- Belongs To User
- Belongs To Specialization
- Has Many DoctorHospitals
- Has Many AvailabilityRules
- Has Many Appointments
- Has Many Reviews

---

# Specialization

Medical specialty category.

## Fields

- id
- name
- description
- icon
- createdAt
- updatedAt

## Examples

- Cardiology
- Dentistry
- Pediatrics
- Dermatology
- Orthopedics
- Optometry

## Relationships

- Has Many Doctors

---

# Hospital

Healthcare facility.

## Fields

- id
- name
- description
- address
- city
- state
- country
- phoneNumber
- email
- imageUrl
- isActive
- createdAt
- updatedAt

## Relationships

- Has Many DoctorHospitals
- Has Many Appointments

---

# DoctorHospital

Many-to-many relationship between doctors and hospitals.

A doctor may work in multiple hospitals.

A hospital may have multiple doctors.

## Fields

- id
- doctorId
- hospitalId
- createdAt

## Relationships

- Belongs To Doctor
- Belongs To Hospital

---

# MembershipPlan

Defines available healthcare packages.

## Fields

- id
- name
- description
- monthlyPrice
- yearlyPrice
- consultationLimit
- supportsVirtualConsultation
- isActive
- createdAt
- updatedAt

## Examples

- Individual Plan
- Family Plan
- Premium Plan

## Relationships

- Has Many MembershipSubscriptions

---

# MembershipSubscription

Patient subscription record.

## Fields

- id
- patientId
- membershipPlanId
- status
- startDate
- endDate
- autoRenew
- createdAt
- updatedAt

## Relationships

- Belongs To Patient
- Belongs To MembershipPlan

---

# AvailabilityRule

Defines recurring doctor availability.

## Fields

- id
- doctorId
- dayOfWeek
- startTime
- endTime
- isActive
- createdAt
- updatedAt

## Relationships

- Belongs To Doctor

---

# Appointment

Core healthcare booking entity.

Supports both physical and virtual appointments.

## Fields

- id
- patientId
- doctorId
- hospitalId
- appointmentType
- appointmentStatus
- appointmentDate
- appointmentStartTime
- appointmentEndTime
- reasonForVisit
- notes
- createdAt
- updatedAt

## Relationships

- Belongs To Patient
- Belongs To Doctor
- Belongs To Hospital
- Has One Consultation
- Has One Review

---

# Consultation

Virtual consultation record.

Created only for virtual appointments.

## Fields

- id
- appointmentId
- status
- meetingProvider
- meetingRoomId
- meetingUrl
- symptoms
- diagnosis
- recommendations
- followUpRequired
- followUpNotes
- startedAt
- endedAt
- createdAt
- updatedAt

## Relationships

- Belongs To Appointment

---

# Review

Patient feedback.

## Fields

- id
- patientId
- doctorId
- appointmentId
- rating
- comment
- createdAt
- updatedAt

## Relationships

- Belongs To Patient
- Belongs To Doctor
- Belongs To Appointment

---

# Notification

System-generated notification.

## Fields

- id
- userId
- type
- title
- message
- isRead
- createdAt

## Relationships

- Belongs To User

---

# FileUpload

Stores uploaded file metadata.

Actual files live in Vercel Blob.

## Fields

- id
- uploadedByUserId
- fileName
- fileType
- fileUrl
- createdAt

## Relationships

- Belongs To User

---

# AuditLog

Tracks important system actions.

## Fields

- id
- userId
- action
- entityType
- entityId
- metadata
- createdAt

## Relationships

- Belongs To User

## Examples

- Doctor Verified
- Membership Activated
- Appointment Cancelled
- Consultation Completed

---

# Storage Responsibilities

## PostgreSQL

Stores:

- Users
- Patients
- Doctors
- Membership Plans
- Membership Subscriptions
- Hospitals
- Appointments
- Consultations
- Reviews
- Notifications
- Audit Logs

---

## Vercel Blob

Stores:

- Profile Images
- Hospital Images
- Doctor Certifications
- Consultation Documents
- Uploaded Files

Database records store only file URLs.

---

# Core Relationships

User
└── PatientProfile

User
└── DoctorProfile

PatientProfile
└── MembershipSubscription

MembershipPlan
└── MembershipSubscription

DoctorProfile
└── Specialization

DoctorProfile
└── DoctorHospital

Hospital
└── DoctorHospital

PatientProfile
└── Appointment

DoctorProfile
└── Appointment

Appointment
└── Consultation

Appointment
└── Review

User
└── Notification

User
└── AuditLog

User
└── FileUpload

---

# Database Invariants

1. Every PatientProfile belongs to one User.
2. Every DoctorProfile belongs to one User.
3. Every Appointment belongs to one Patient and one Doctor.
4. Virtual appointments create Consultation records.
5. Physical appointments require Hospital records.
6. Doctors cannot be double-booked.
7. Only verified doctors may receive appointments.
8. Only active memberships may create appointments.
9. Reviews require completed appointments.
10. Consultation records belong only to their appointment.
11. Uploaded files are stored outside the relational database.
12. Audit logs are immutable.
