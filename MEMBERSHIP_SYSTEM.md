# Membership System Documentation

## Overview

The GoodHealth Membership System enables patients to subscribe to healthcare plans and manage their subscriptions. It provides a complete membership lifecycle including discovery, subscription, management, and renewal.

## Architecture

### Database Models

#### MembershipPlan

```prisma
model MembershipPlan {
  id                          String   @id @default(cuid())
  name                        String   @unique
  description                 String?
  monthlyPrice                Decimal  @db.Decimal(10, 2)
  yearlyPrice                 Decimal? @db.Decimal(10, 2)
  consultationLimit           Int?
  supportsVirtualConsultation Boolean  @default(false)
  isActive                    Boolean  @default(true)
  createdAt                   DateTime @default(now())
  updatedAt                   DateTime @updatedAt

  membershipSubscriptions MembershipSubscription[]
}
```

Represents available membership plans with pricing and features.

#### MembershipSubscription

```prisma
model MembershipSubscription {
  id               String           @id @default(cuid())
  patientId        String
  membershipPlanId String
  status           MembershipStatus @default(ACTIVE)
  startDate        DateTime
  endDate          DateTime
  autoRenew        Boolean          @default(false)
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  patient        PatientProfile @relation(fields: [patientId], references: [id], onDelete: Cascade)
  membershipPlan MembershipPlan @relation(fields: [membershipPlanId], references: [id], onDelete: Restrict)
}
```

Represents a patient's subscription to a membership plan.

### Enums

#### MembershipStatus

- `ACTIVE` - Membership is active and valid
- `EXPIRED` - Membership has expired
- `CANCELLED` - Patient cancelled the membership
- `SUSPENDED` - Membership suspended (e.g., payment issue)

## Server Actions

Located in: `actions/memberships/index.ts`

### Membership Queries

#### `getMembershipPlans()`

Get all active membership plans, ordered by price.

```typescript
const plans = await getMembershipPlans();
```

#### `getMembershipPlanById(planId: string)`

Get a specific membership plan by ID.

```typescript
const plan = await getMembershipPlanById("plan_123");
```

#### `getPatientActiveMembership(patientId: string)`

Get the patient's current active membership (if any).

```typescript
const membership = await getPatientActiveMembership("patient_123");
```

#### `getPatientMemberships(patientId: string)`

Get all patient memberships (active, expired, cancelled).

```typescript
const memberships = await getPatientMemberships("patient_123");
```

#### `hasActiveMembership(patientId: string): boolean`

Check if patient has an active membership.

```typescript
const isActive = await hasActiveMembership("patient_123");
```

### Membership Management

#### `createMembershipSubscription(patientId, planId, billingPeriod)`

Create a new membership subscription.

```typescript
const subscription = await createMembershipSubscription(
  "patient_123",
  "plan_456",
  "monthly",
);
```

#### `cancelMembershipSubscription(subscriptionId)`

Cancel a membership subscription.

```typescript
const cancelled = await cancelMembershipSubscription("sub_789");
```

#### `renewMembershipSubscription(subscriptionId)`

Renew an expiring or expired membership.

```typescript
const renewed = await renewMembershipSubscription("sub_789");
```

#### `updateAutoRenew(subscriptionId, autoRenew)`

Update auto-renewal setting.

```typescript
await updateAutoRenew("sub_789", true);
```

### Statistics

#### `getMembershipStats()`

Get membership statistics.

```typescript
const stats = await getMembershipStats();
// Returns: { totalPlans, activePlans, activeSubscriptions, expiredSubscriptions }
```

## UI Components

Located in: `components/memberships/`

### MembershipPlanCard

Display a single membership plan with features and pricing.

**Props:**

- `plan` - Plan data
- `isActive` - Whether plan is available
- `isCurrentPlan` - Whether this is user's current plan
- `billingPeriod` - 'monthly' or 'yearly'
- `onSelect` - Callback when plan is selected

```tsx
<MembershipPlanCard
  plan={plan}
  isCurrentPlan={false}
  billingPeriod="monthly"
  onSelect={(planId, period) => handleSelect(planId, period)}
/>
```

### MembershipPlanGrid

Display multiple membership plans in a responsive grid.

**Props:**

- `plans` - Array of plans
- `currentPlanId` - ID of user's current plan
- `billingPeriod` - 'monthly' or 'yearly'
- `onSelectPlan` - Callback when plan is selected

```tsx
<MembershipPlanGrid
  plans={plans}
  currentPlanId={currentPlanId}
  billingPeriod="monthly"
  onSelectPlan={handleSelect}
/>
```

### MembershipStatus

Display current membership status with progress bar.

**Props:**

- `subscription` - Subscription object with plan details
- `className` - Optional CSS classes

```tsx
<MembershipStatus subscription={activeMembership} />
```

### MembershipHistory

Display list of all memberships (active, expired, cancelled).

**Props:**

- `subscriptions` - Array of subscription objects
- `className` - Optional CSS classes

```tsx
<MembershipHistory subscriptions={allMemberships} />
```

### BillingPeriodToggle

Toggle between monthly and yearly billing.

**Props:**

- `period` - Current period ('monthly' or 'yearly')
- `onChange` - Callback when period changes

```tsx
<BillingPeriodToggle period={billingPeriod} onChange={setPeriod} />
```

## Pages

### Patient Routes

#### `/patient/membership`

Browse available membership plans and compare features.

**Features:**

- Plan grid with pricing
- Billing period toggle (monthly/yearly)
- Plan comparison
- FAQ section

#### `/patient/membership/[planId]/checkout`

Checkout page for selected membership plan.

**Features:**

- Order summary
- Plan details and features
- Security information
- Subscribe button

#### `/patient/membership/manage`

Membership management dashboard.

**Features:**

- Current membership status
- Auto-renewal toggle
- Renew option
- Cancel option
- Membership history

#### `/patient/membership/success`

Success page after subscription creation.

**Features:**

- Success message
- Next steps
- Auto-redirect to dashboard

### Admin Routes

#### `/admin/memberships`

Membership management dashboard for admins.

**Features:**

- Membership statistics
- Plans table with pricing
- Edit/create plan options
- Active/inactive status toggle

## API Routes

### GET /api/memberships/plans

Get all active membership plans.

**Response:**

```json
{
  "plans": [
    {
      "id": "plan_123",
      "name": "Basic",
      "monthlyPrice": 29.99,
      "yearlyPrice": 299.99,
      "consultationLimit": 3,
      "supportsVirtualConsultation": true
    }
  ]
}
```

### GET /api/memberships/status

Get current user's membership status (requires authentication).

**Response:**

```json
{
  "hasActive": true,
  "membership": {
    "id": "sub_123",
    "status": "ACTIVE",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-02-01T00:00:00Z",
    "autoRenew": true,
    "membershipPlan": {
      "name": "Basic",
      "monthlyPrice": 29.99
    }
  }
}
```

## Business Rules

1. **Membership Required**: Patients must have an ACTIVE membership to access healthcare services
2. **Single Active Membership**: A patient can only have one ACTIVE membership at a time
3. **Auto-Renewal**: Memberships can be set to auto-renew on expiration
4. **Cancellation**: Active memberships can be cancelled immediately
5. **No Refunds**: Cancelled memberships are not refunded
6. **Status Transitions**: Only ACTIVE memberships can access services; EXPIRED/CANCELLED/SUSPENDED cannot

## Usage Examples

### Browse Plans

```typescript
// Get all active plans
const plans = await getMembershipPlans();
```

### Subscribe to Plan

```typescript
// Create subscription
const subscription = await createMembershipSubscription(
  patientId,
  planId,
  "monthly",
);
```

### Check Membership

```typescript
// Before allowing appointment booking
const hasActive = await hasActiveMembership(patientId);
if (!hasActive) {
  throw new Error("Active membership required");
}
```

### Manage Membership

```typescript
// Get user's active membership
const membership = await getPatientActiveMembership(patientId);

// Cancel membership
await cancelMembershipSubscription(membership.id);

// Renew membership
await renewMembershipSubscription(membership.id);
```

## Integration Points

### Appointment Booking

Before allowing appointment booking, verify active membership:

```typescript
const hasActive = await hasActiveMembership(patientId);
if (!hasActive) {
  throw new Error("Please activate a membership to book appointments");
}
```

### Dashboard

Display membership status on patient dashboard:

```tsx
const membership = await getPatientActiveMembership(patientId);
if (membership) {
  <MembershipStatus subscription={membership} />;
}
```

### Consultation Booking

Check for virtual consultation support:

```typescript
const membership = await getPatientActiveMembership(patientId);
if (
  consultationType === "VIRTUAL" &&
  !membership?.membershipPlan.supportsVirtualConsultation
) {
  throw new Error("Your plan does not include video consultations");
}
```

## Default Membership Plans

GoodHealth comes with three default membership plans (to be seeded):

### Basic

- **Price**: $29.99/month or $299.99/year
- **Consultations**: 3 per month
- **Virtual Consultations**: Yes
- **Features**: Doctor directory, Health records, 24/7 support

### Premium

- **Price**: $59.99/month or $599.99/year
- **Consultations**: Unlimited
- **Virtual Consultations**: Yes
- **Features**: All Basic + Priority support, Advanced health analytics

### Enterprise

- **Price**: Custom pricing
- **Consultations**: Unlimited
- **Virtual Consultations**: Yes
- **Features**: All Premium + Dedicated support, Custom features

## Testing

### Test Scenarios

1. **Browse Plans**
   - Visit `/patient/membership`
   - See all active plans
   - Toggle between monthly/yearly

2. **Subscribe**
   - Click "Select Plan"
   - Review checkout page
   - Create subscription

3. **Manage**
   - Visit `/patient/membership/manage`
   - See active membership
   - Enable/disable auto-renewal
   - Renew membership
   - Cancel membership

4. **History**
   - See past memberships
   - Status of each subscription

## Security Considerations

1. **Authentication**: Membership management requires authenticated user
2. **Authorization**: Users can only view/manage their own memberships
3. **Payment Processing**: Actual payment handled by payment provider (Stripe, etc.)
4. **Data Protection**: Membership data encrypted and access-controlled
5. **Audit Trail**: All membership changes logged for compliance

## Future Enhancements

1. **Payment Integration**: Stripe/PayPal for actual payments
2. **Email Notifications**: Renewal reminders, cancellation confirmations
3. **Family Plans**: Multi-user family memberships
4. **Promo Codes**: Discount codes and promotional pricing
5. **Billing History**: Invoice generation and management
6. **Analytics**: Membership metrics and revenue tracking
7. **Cancellation Surveys**: Understand why customers cancel
8. **Win-back Campaigns**: Re-engagement offers for cancelled members

## Troubleshooting

### Issue: User cannot book appointments

**Solution**: Check if user has active membership using `hasActiveMembership()`

### Issue: Cannot renew membership

**Solution**: Ensure subscription exists and user is authenticated

### Issue: Membership shows as expired

**Solution**: Check `endDate` against current date; call `renewMembershipSubscription()` if within grace period

## Support

For membership system issues:

1. Check database for subscription records
2. Verify user authentication
3. Check action logs for errors
4. Contact admin team if needed
