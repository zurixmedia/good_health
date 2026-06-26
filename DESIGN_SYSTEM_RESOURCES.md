# Design System Resource Guide

## Documentation Files

### Primary Documentation

1. **DESIGN_SYSTEM.md** - Complete design system documentation
   - Overview and principles
   - All design tokens
   - Component library reference
   - Usage examples
   - Best practices
   - Accessibility guide

2. **DESIGN_SYSTEM_QUICKSTART.md** - Quick reference guide
   - Import paths
   - Common patterns
   - Design token usage
   - Best practices checklist
   - Responsive guidelines
   - Troubleshooting

3. **IMPLEMENTATION_SUMMARY.md** - What was created
   - Overview of implementation
   - File structure
   - Component inventory
   - Design token inventory
   - Next steps

## Interactive Resources

### Design System Showcase

**URL**: `/design-system`

Visual demonstration of:

- All typography scales
- Color system
- Badge variants
- Status indicators
- Card components
- Metrics and statistics
- Alert variants
- Layout systems
- Empty states

Access by navigating to the `/design-system` route in your browser.

## Code Resources

### Theme Tokens

```
lib/theme/
├── colors.ts          # Brand and semantic colors
├── typography.ts      # Font scales and styles
├── spacing.ts         # 8-point grid system
├── breakpoints.ts     # Responsive breakpoints
└── index.ts          # All exports
```

### Layout Components

```
components/layout/
├── container.tsx      # PageContainer, Container, Section
├── structure.tsx      # Header, Main, Footer, Layout
├── sidebar.tsx        # Sidebar components
├── topnav.tsx         # Top navigation
├── navbar.tsx         # Main navigation bar
├── navigation.ts      # Navigation components
└── index.ts          # All exports
```

### Shared UI Components

```
components/shared/
├── card.tsx           # Card components
├── badge.tsx          # Badge components
├── typography.tsx     # Typography components
├── alert.tsx          # Alert components
├── divider.tsx        # Divider component
├── layout-utils.tsx   # Grid, Flex, Stack
├── utility-components.tsx # Metric, InfoItem, EmptyState
├── doctor-info.tsx    # Healthcare: Doctor display
├── appointment-info.tsx # Healthcare: Appointment display
└── index.ts          # All exports
```

## Component Index by Category

### Layout & Structure

- `PageContainer` - Content width constraint
- `Container` - Minimal content wrapper
- `Section` - Semantic section with spacing
- `Layout` - Full page layout wrapper
- `Header` - Page header
- `Main` - Main content area
- `Footer` - Page footer

### Navigation

- `Navbar` - Main navigation bar
- `NavLink` - Navigation link with active state
- `NavItem` - Navigation item container
- `NavGroup` - Navigation item group
- `Sidebar` - Side navigation
- `TopNav` - Top navigation bar

### Cards & Containers

- `Card` - General purpose container
- `CardHeader` - Card header section
- `CardBody` - Card body section
- `CardFooter` - Card footer section
- `CardTitle` - Card title
- `CardDescription` - Card description

### Typography

- `H1` - Main heading
- `H2` - Section heading
- `H3` - Subsection heading
- `H4` - Small heading
- `Body` - Body text
- `Text` - Inline text
- `Label` - Form label
- `Caption` - Supporting text
- `Muted` - De-emphasized text

### Status & Badges

- `Badge` - Generic badge
- `StatusBadge` - Healthcare status indicator

### Alerts & Feedback

- `Alert` - Contextual message
- `AlertTitle` - Alert title
- `AlertDescription` - Alert description
- `Divider` - Visual separator

### Layout Utilities

- `Grid` - Responsive grid
- `Flex` - Flexible container
- `Stack` - Vertical stack
- `AspectRatio` - Aspect ratio container

### Utilities

- `Metric` - Key metric display
- `InfoItem` - Information display
- `EmptyState` - No content state

### Healthcare Specific

- `DoctorInfo` - Doctor information display
- `AppointmentInfo` - Appointment details

## Import Examples

### All Layout Components

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
  TopNav,
} from "@/components/layout";
```

### All Shared Components

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

  // Layout
  Grid,
  Flex,
  Stack,
  AspectRatio,

  // Feedback
  Alert,
  AlertTitle,
  AlertDescription,
  Divider,

  // Utilities
  Metric,
  InfoItem,
  EmptyState,

  // Healthcare
  DoctorInfo,
  AppointmentInfo,
} from "@/components/shared";
```

## Theme Token Usage

### CSS Variables

All theme tokens available as CSS variables:

```tsx
// In CSS
.element {
  color: var(--primary-500);
  padding: var(--spacing-md);
  font-family: var(--font-primary);
  border-radius: var(--radius-lg);
}
```

### Tailwind Classes

Use Tailwind classes for styling:

```tsx
<div className="bg-blue-500 text-white p-6 rounded-lg">Styled content</div>
```

### Theme Imports

Import tokens directly in TypeScript:

```tsx
import { colors, typography, spacing, breakpoints } from "@/lib/theme";
```

## Best Practices Quick Reference

✅ **DO**

- Use semantic components
- Use design tokens for styling
- Build mobile-first
- Use Grid/Flex for layouts
- Use Stack for vertical spacing
- Use component variants

❌ **DON'T**

- Create custom spacing values
- Use inline styles for colors
- Skip heading levels
- Use arbitrary Tailwind values
- Build desktop-first
- Break component API contracts

## Common Usage Patterns

### Basic Page

```tsx
<Layout>
  <Header>
    <Navbar>...</Navbar>
  </Header>
  <Main>
    <PageContainer>
      <H1>Title</H1>
      <Body>Content</Body>
    </PageContainer>
  </Main>
  <Footer>
    <Container>Footer</Container>
  </Footer>
</Layout>
```

### Grid of Cards

```tsx
<Grid columns={3} gap="md">
  <Card hoverable>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardBody>Content</CardBody>
  </Card>
</Grid>
```

### Responsive Layout

```tsx
<Flex direction="col" justify="between">
  <H2>Section</H2>
  <Grid columns={2} gap="md">
    <Card>Item 1</Card>
    <Card>Item 2</Card>
  </Grid>
</Flex>
```

### Status Display

```tsx
<div className="flex items-center gap-2">
  <span>Appointment Status:</span>
  <StatusBadge status="confirmed" />
</div>
```

## Troubleshooting Resources

### Issue: Component styling not appearing

See: DESIGN_SYSTEM_QUICKSTART.md → Troubleshooting

### Issue: Responsive styles not working

See: DESIGN_SYSTEM_QUICKSTART.md → Responsive Design

### Issue: Colors not showing

See: DESIGN_SYSTEM_QUICKSTART.md → Design Tokens

### Issue: Component API usage

See: DESIGN_SYSTEM.md → Component Library

## Getting Help

1. Check the quick start guide first
2. Review full documentation
3. Look at component examples
4. Check the design system showcase
5. Review component source code

## Next Steps for Developers

1. **Read**: Start with DESIGN_SYSTEM_QUICKSTART.md
2. **Explore**: Visit `/design-system` page
3. **Reference**: Bookmark DESIGN_SYSTEM.md
4. **Build**: Start using components in your pages
5. **Follow**: Use consistent patterns from showcase

## File Locations Summary

| Resource          | Location                      |
| ----------------- | ----------------------------- |
| Full Docs         | `DESIGN_SYSTEM.md`            |
| Quick Guide       | `DESIGN_SYSTEM_QUICKSTART.md` |
| Implementation    | `IMPLEMENTATION_SUMMARY.md`   |
| Showcase          | `/design-system` page         |
| Theme Tokens      | `lib/theme/`                  |
| Layout Components | `components/layout/`          |
| Shared Components | `components/shared/`          |
| UI/UX Guidelines  | `context/UI_UX_GUIDELINES.md` |
| Figma Reference   | `context/FIGMA_REFERENCE.md`  |

## Version Information

- **Design System Version**: 1.0.0
- **Last Updated**: 2024
- **Components**: 44+
- **Design Tokens**: 100+
- **TypeScript**: Fully typed
- **Tailwind CSS**: Integrated
- **Next.js**: App Router ready

## Feedback & Improvements

When adding to or improving the design system:

1. Maintain consistency with existing components
2. Follow established naming conventions
3. Update documentation accordingly
4. Test accessibility
5. Ensure responsive design
6. Add to showcase if appropriate
