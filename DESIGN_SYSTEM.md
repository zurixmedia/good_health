# GoodHealth Design System Documentation

## Overview

The GoodHealth design system provides a comprehensive foundation for building consistent, accessible, and professional healthcare interfaces. It follows the guidelines defined in `UI_UX_GUIDELINES.md` and is based on designs from Figma.

## Core Principles

### Trust First

Healthcare platforms must inspire confidence through:

- Professional, clean interfaces
- Reliable and secure visual indicators
- Minimal unnecessary animations

### Simplicity

Complex workflows are broken into clear steps with:

- Clear visual hierarchy
- Consistent interaction patterns
- Minimal cognitive load

### Consistency

Same interactions behave the same way throughout:

- Unified component library
- Consistent styling and spacing
- Predictable user patterns

### Accessibility

All interfaces are designed for users of all technical abilities and ages.

## Design Tokens

### Colors

#### Primary Brand Colors

- **Healthcare Blue**: `#0ea5e9` - Primary brand color for trust and professionalism
- **Healthcare Green**: `#22c55e` - Secondary brand color for health and vitality

#### Semantic Colors

- **Success**: `#22c55e` - Completed appointments, active memberships
- **Warning**: `#f59e0b` - Expiring memberships, pending verification
- **Error**: `#ef4444` - Validation failures, cancellations
- **Info**: `#0ea5e9` - Notifications, educational content

#### Status Colors

- **Pending**: `#f59e0b` - Awaiting action
- **Confirmed**: `#0ea5e9` - Confirmed/scheduled
- **Completed**: `#22c55e` - Successfully completed
- **Cancelled**: `#ef4444` - Cancelled/failed

### Typography

#### Font Family

- **Primary**: Inter (with system font fallbacks)
- **Monospace**: Fira Code (for technical content)

#### Heading Scale

```
H1: 2.25rem (36px) - Hero sections, major titles
H2: 1.875rem (30px) - Section titles
H3: 1.5rem (24px) - Card titles, subsections
H4: 1.25rem (20px) - Smaller titles
H5: 1.125rem (18px) - Small headings
H6: 1rem (16px) - Minimal heading
```

#### Body Text

```
Large: 1.125rem (18px)
Base: 1rem (16px) - Default
Small: 0.875rem (14px)
XSmall: 0.75rem (12px)
```

#### Other

```
Caption: 0.75rem (12px) - Metadata, timestamps
Label: 0.875rem (14px) - Form labels
```

### Spacing System

8-point baseline grid for consistency:

```
xs:  0.5rem (8px)
sm:  1rem (16px)
md:  1.5rem (24px)
lg:  2rem (32px)
xl:  2.5rem (40px)
2xl: 3rem (48px)
3xl: 4rem (64px)
4xl: 5rem (80px)
```

### Border Radius

```
sm:   0.375rem (6px)
base: 0.5rem (8px)
md:   0.75rem (12px)
lg:   1rem (16px)
xl:   1.5rem (24px)
full: 9999px (circular)
```

### Responsive Breakpoints

Mobile-first design:

```
xs:  0px (mobile)
sm:  640px (tablet)
md:  768px (small laptop)
lg:  1024px (laptop)
xl:  1280px (desktop)
2xl: 1536px (large desktop)
```

## Component Library

### Layout Components

#### `PageContainer`

Constrains content width for better readability on large displays.

```tsx
<PageContainer maxWidth="xl" padding="md">
  {children}
</PageContainer>
```

#### `Container`

Minimal wrapper for constraining content.

```tsx
<Container>{children}</Container>
```

#### `Section`

Semantic section with vertical spacing.

```tsx
<Section padding>{children}</Section>
```

#### `Layout`

Flex layout that ensures footer sticks to bottom.

```tsx
<Layout>
  <Header>{/* ... */}</Header>
  <Main>{/* ... */}</Main>
  <Footer>{/* ... */}</Footer>
</Layout>
```

#### `Header`, `Main`, `Footer`

Semantic structural components.

#### `Sidebar`, `Sidebar Content`

Side navigation component with optional collapse.

### Navigation Components

#### `Navbar`

Main navigation bar with logo and nav items.

#### `NavLink`

Navigation link with automatic active state.

#### `NavGroup`

Groups navigation items together.

### Card Components

#### `Card`

Container for grouped content with optional hover effect.

Variants:

- `hoverable` - Adds hover animation
- `bordered` - Shows border (default)
- `padding` - 'none' | 'sm' | 'md' | 'lg'

#### `CardHeader`, `CardBody`, `CardFooter`

Sections within a card.

#### `CardTitle`, `CardDescription`

Typography within cards.

### Typography Components

#### Headings

- `H1` - Largest heading
- `H2` - Large heading
- `H3` - Medium heading
- `H4` - Small heading

#### Body Text

- `Body` - Standard body text with size and muted variants
- `Text` - Inline text
- `Label` - Form labels with optional required indicator
- `Caption` - Small supporting text
- `Muted` - De-emphasized text

### Badge Components

#### `Badge`

Small label for tagging and categorization.

Variants: default | primary | secondary | success | warning | error | info

#### `StatusBadge`

Healthcare status indicator.

Statuses: pending | confirmed | completed | cancelled

### Alert Components

#### `Alert`

Contextual message display.

Variants: info | success | warning | error

#### `AlertTitle`, `AlertDescription`

Content within alerts.

### Layout Utilities

#### `Grid`

Responsive grid layout.

```tsx
<Grid columns={3} gap="md">
  {children}
</Grid>
```

#### `Flex`

Flexible layout with alignment options.

```tsx
<Flex direction="row" justify="between" align="center" gap="md">
  {children}
</Flex>
```

#### `Stack`

Vertical stack with consistent spacing.

```tsx
<Stack spacing="md">{children}</Stack>
```

#### `AspectRatio`

Maintains aspect ratio for responsive content.

### Healthcare-Specific Components

#### `DoctorInfo`

Displays doctor information and credentials.

#### `AppointmentInfo`

Shows appointment details with status.

### Utility Components

#### `Metric`

Displays a key metric or statistic.

#### `InfoItem`

Labeled information display.

#### `EmptyState`

Shown when no content is available.

#### `Divider`

Visual separator between content.

## Usage Examples

### Basic Page Layout

```tsx
import {
  Layout,
  Header,
  Main,
  Footer,
  PageContainer,
  Navbar,
  NavLink,
  H1,
  Body,
} from "@/components/layout";
import { Container } from "@/components/shared";

export default function Page() {
  return (
    <Layout>
      <Header>
        <Navbar logo={<h1>GoodHealth</h1>}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
        </Navbar>
      </Header>

      <Main>
        <PageContainer>
          <H1>Welcome to GoodHealth</H1>
          <Body>Your trusted healthcare platform.</Body>
        </PageContainer>
      </Main>

      <Footer>
        <Container>
          <p>&copy; 2024 GoodHealth</p>
        </Container>
      </Footer>
    </Layout>
  );
}
```

### Card Grid

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
          <CardTitle>Metric 1</CardTitle>
        </CardHeader>
        <CardBody>Content here</CardBody>
      </Card>
      {/* More cards... */}
    </Grid>
  );
}
```

### Alert Display

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/shared";

export default function Example() {
  return (
    <Alert variant="success">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>Your appointment has been confirmed.</AlertDescription>
    </Alert>
  );
}
```

## Best Practices

### Spacing

- Use only spacing tokens from the 8-point grid
- Maintain vertical rhythm by using consistent spacing units
- Don't use arbitrary spacing values

### Typography

- Use semantic heading levels (H1, H2, H3, etc.)
- Never skip heading levels for styling
- Use `Body` component for paragraph text
- Use `Muted` or `Caption` for supporting text

### Colors

- Use semantic colors (success, warning, error) for meaning
- Don't use color alone to convey meaning
- Maintain sufficient contrast for accessibility

### Cards

- Use `Card` for grouping related content
- Keep card padding consistent
- Use `hoverable` only for interactive cards
- Use `CardHeader` for titles

### Responsive Design

- Design mobile-first
- Test at all breakpoints
- Use responsive grid utilities
- Adjust typography and spacing as needed

## Accessibility

All components are built with accessibility in mind:

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Focus indicators
- Screen reader friendly

## CSS Variables

All design tokens are available as CSS custom properties:

```css
/* Colors */
var(--primary-500)
var(--secondary-500)
var(--success)
var(--warning)
var(--error)

/* Spacing */
var(--spacing-sm)
var(--spacing-md)
var(--spacing-lg)

/* Typography */
var(--font-primary)
var(--font-mono)

/* Border Radius */
var(--radius-md)
var(--radius-lg)
```

## Troubleshooting

### Component not styling correctly

- Ensure Tailwind CSS is properly configured
- Check that all required props are provided
- Verify className merging with `cn()` utility

### Responsive breakpoints not working

- Ensure you're using Tailwind breakpoint prefixes (sm:, md:, lg:)
- Test in mobile viewport first (mobile-first approach)
- Check breakpoint values in theme config

### Colors not appearing

- Verify CSS variables are defined in globals.css
- Check that color classes are imported from utilities
- Ensure Tailwind config includes color values

## Support

For design system questions or component additions:

1. Check the Figma reference in `context/FIGMA_REFERENCE.md`
2. Review UI/UX guidelines in `context/UI_UX_GUIDELINES.md`
3. Check existing component implementations
4. Create new components following established patterns
