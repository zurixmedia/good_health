# Design System Quick Start Guide

## Getting Started

The GoodHealth design system is now available for building consistent interfaces across the platform. This guide will help you get up to speed quickly.

## Import Paths

### Layout Components

```tsx
import {
  Layout,
  Header,
  Main,
  Footer,
  PageContainer,
  Container,
  Section,
  Navbar,
  NavLink,
  NavGroup,
  Sidebar,
} from "@/components/layout";
```

### Shared UI Components

```tsx
import {
  // Cards
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardDescription,

  // Typography
  H1,
  H2,
  H3,
  H4,
  Body,
  Text,
  Label,
  Caption,
  Muted,

  // Badges
  Badge,
  StatusBadge,

  // Layout Utilities
  Grid,
  Flex,
  Stack,
  AspectRatio,

  // Alerts
  Alert,
  AlertTitle,
  AlertDescription,

  // Utilities
  Metric,
  InfoItem,
  EmptyState,
  Divider,

  // Healthcare Specific
  DoctorInfo,
  AppointmentInfo,
} from "@/components/shared";
```

## Common Patterns

### Creating a Page

```tsx
"use client";

import {
  Layout,
  Header,
  Main,
  Footer,
  PageContainer,
  Navbar,
  NavLink,
  Container,
} from "@/components/layout";
import { H1, Body } from "@/components/shared";

export default function MyPage() {
  return (
    <Layout>
      <Header>
        <Navbar logo={<h1 className="font-bold">GoodHealth</h1>}>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/services">Services</NavLink>
        </Navbar>
      </Header>

      <Main>
        <PageContainer>
          <H1>Page Title</H1>
          <Body>Page description goes here.</Body>
        </PageContainer>
      </Main>

      <Footer>
        <Container className="py-8">
          <p>Footer content</p>
        </Container>
      </Footer>
    </Layout>
  );
}
```

### Creating a Card Grid

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Grid,
} from "@/components/shared";

export default function Dashboard() {
  return (
    <Grid columns={3} gap="md">
      <Card hoverable>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardBody>Card content here</CardBody>
      </Card>

      <Card hoverable>
        <CardHeader>
          <CardTitle>Another Card</CardTitle>
        </CardHeader>
        <CardBody>More content</CardBody>
      </Card>
    </Grid>
  );
}
```

### Displaying Status

```tsx
import { StatusBadge } from "@/components/shared";

export default function AppointmentStatus() {
  return (
    <div>
      <StatusBadge status="pending" />
      <StatusBadge status="confirmed" />
      <StatusBadge status="completed" />
    </div>
  );
}
```

### Responsive Layout

```tsx
import { Stack, Flex, Grid } from "@/components/shared";

export default function ResponsiveExample() {
  return (
    <Stack spacing="lg">
      <h2>Title</h2>

      <Flex justify="between" align="center">
        <span>Left</span>
        <span>Right</span>
      </Flex>

      <Grid columns={3} gap="md">
        {/* items */}
      </Grid>
    </Stack>
  );
}
```

## Design Tokens

### Colors (CSS Variables)

Available in Tailwind and CSS variables:

```tsx
// Tailwind
<div className="bg-blue-500 text-white">Content</div>

// CSS
<div style={{ backgroundColor: 'var(--primary-500)' }}>Content</div>
```

Colors:

- Primary: `bg-blue-*` / `var(--primary-*)`
- Secondary: `bg-green-*` / `var(--secondary-*)`
- Status: `bg-green-500`, `bg-amber-500`, `bg-red-500`

### Spacing

8-point grid system:

```tsx
<div className="p-4">
  {" "}
  {/* md: 24px */}
  <div className="mb-2">
    {" "}
    {/* xs: 8px */}
    Content
  </div>
</div>
```

Tokens: `xs` (8px), `sm` (16px), `md` (24px), `lg` (32px), `xl` (40px)

### Typography

```tsx
// Headings
<H1>Main Title</H1>
<H2>Section Title</H2>
<H3>Card Title</H3>

// Body Text
<Body>Regular paragraph text</Body>
<Body size="sm">Smaller text</Body>
<Body muted>De-emphasized text</Body>

// Labels
<Label htmlFor="input" required>Field Label</Label>

// Supporting
<Caption>Supporting text</Caption>
<Muted>Muted text</Muted>
```

## Best Practices

### DO

✅ Use semantic components (`Card`, `Alert`, etc.)
✅ Use design tokens for spacing and colors
✅ Build mobile-first with responsive utilities
✅ Use Grid/Flex for layouts
✅ Use Stack for vertical spacing

### DON'T

❌ Create custom spacing values
❌ Use inline styles for colors
❌ Skip heading levels in markup
❌ Use arbitrary Tailwind values
❌ Build desktop-first

## Responsive Breakpoints

Mobile-first approach:

```tsx
// Small by default, larger on tablet/desktop
<div className="col-span-1 md:col-span-2 lg:col-span-3">Responsive column</div>
```

Breakpoints:

- `sm`: 640px (tablet)
- `md`: 768px (small laptop)
- `lg`: 1024px (laptop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (large desktop)

## Component Examples

### Alert Example

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/shared";

<Alert variant="success">
  <AlertTitle>Appointment Confirmed</AlertTitle>
  <AlertDescription>
    Your appointment has been scheduled for tomorrow at 2:00 PM.
  </AlertDescription>
</Alert>;
```

### Badge Example

```tsx
import { Badge, StatusBadge } from '@/components/shared';

<Badge variant="primary">Featured</Badge>
<StatusBadge status="confirmed" />
```

### Empty State Example

```tsx
import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";

<EmptyState
  title="No Appointments"
  description="Schedule your first appointment today"
  action={<Button>Schedule Now</Button>}
/>;
```

## Layout Patterns

### Full-Width Layout

```tsx
<Section fullWidth>Content spans full width</Section>
```

### Constrained Content

```tsx
<PageContainer maxWidth="xl" padding="lg">
  Content with max width
</PageContainer>
```

### Grid Layout

```tsx
<Grid columns={2} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</Grid>
```

### Flex Container

```tsx
<Flex justify="between" align="center" gap="md">
  <span>Left</span>
  <span>Right</span>
</Flex>
```

## Troubleshooting

### Component styling not appearing

1. Ensure `'use client'` directive at top of file
2. Check imports are correct from `@/components/layout` or `@/components/shared`
3. Verify Tailwind CSS is configured

### Responsive styles not working

1. Use mobile-first approach (no prefix for mobile)
2. Add breakpoint prefix: `sm:`, `md:`, `lg:`, etc.
3. Test in actual mobile viewport

### Colors not showing

1. Use Tailwind classes like `bg-blue-500`
2. Or use CSS variables: `var(--primary-500)`
3. Ensure color is exported from theme

## Additional Resources

- Full documentation: `DESIGN_SYSTEM.md`
- UI/UX Guidelines: `context/UI_UX_GUIDELINES.md`
- Figma Reference: `context/FIGMA_REFERENCE.md`
- Design System Showcase: `/design-system` page
- Component source: `components/shared/` and `components/layout/`
