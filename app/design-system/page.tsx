"use client";

import React from "react";
import {
  Layout,
  Header,
  Main,
  Footer,
  PageContainer,
  Container,
  Navbar,
  NavGroup,
  NavLink,
} from "@/components/layout";
import {
  H1,
  H2,
  H3,
  Body,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Badge,
  StatusBadge,
  Grid,
  Flex,
  Stack,
  Alert,
  AlertTitle,
  AlertDescription,
  Metric,
  EmptyState,
  Divider,
} from "@/components/shared";

/**
 * Design System Showcase Page
 *
 * Demonstrates all available components and design tokens
 * Not meant to be a feature-specific page
 */
export default function DesignSystemPage() {
  return (
    <Layout>
      <Header>
        <Navbar logo={<h1 className="text-xl font-bold">GoodHealth</h1>}>
          <NavGroup>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/design-system">Design System</NavLink>
          </NavGroup>
        </Navbar>
      </Header>

      <Main>
        <PageContainer className="py-12">
          <Stack spacing="xl">
            {/* Typography Section */}
            <section>
              <H2 className="mb-6">Typography</H2>
              <Grid columns={1} gap="md">
                <Card>
                  <CardHeader>
                    <CardTitle>Headings</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div>
                      <H1>Heading 1</H1>
                      <p className="text-xs text-gray-600">
                        Used for hero sections and major page titles
                      </p>
                    </div>
                    <Divider />
                    <div>
                      <H2>Heading 2</H2>
                      <p className="text-xs text-gray-600">
                        Used for section titles
                      </p>
                    </div>
                    <Divider />
                    <div>
                      <H3>Heading 3</H3>
                      <p className="text-xs text-gray-600">
                        Used for card titles
                      </p>
                    </div>
                    <Divider />
                    <Body>
                      Body text - Used for descriptions and general content.
                      This is the default text size for most content.
                    </Body>
                  </CardBody>
                </Card>
              </Grid>
            </section>

            {/* Color System */}
            <section>
              <H2 className="mb-6">Color System</H2>
              <Grid columns={2} gap="md">
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Primary Colors</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="h-16 bg-blue-500 rounded-lg" />
                    <p className="text-sm text-gray-600">Healthcare Blue</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Secondary Colors</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="h-16 bg-green-500 rounded-lg" />
                    <p className="text-sm text-gray-600">Healthcare Green</p>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Success</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="h-16 bg-green-500 rounded-lg" />
                    <p className="text-sm text-gray-600">
                      For completed actions
                    </p>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Warning</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <div className="h-16 bg-amber-500 rounded-lg" />
                    <p className="text-sm text-gray-600">For pending items</p>
                  </CardBody>
                </Card>
              </Grid>
            </section>

            {/* Badges & Status */}
            <section>
              <H2 className="mb-6">Badges & Status</H2>
              <Grid columns={1} gap="md">
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Badge Variants</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Flex gap="md" wrap>
                      <Badge variant="default">Default</Badge>
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="error">Error</Badge>
                      <Badge variant="info">Info</Badge>
                    </Flex>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Status Badges</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Flex gap="md" wrap>
                      <StatusBadge status="pending" />
                      <StatusBadge status="confirmed" />
                      <StatusBadge status="completed" />
                      <StatusBadge status="cancelled" />
                    </Flex>
                  </CardBody>
                </Card>
              </Grid>
            </section>

            {/* Cards */}
            <section>
              <H2 className="mb-6">Cards</H2>
              <Grid columns={2} gap="md">
                <Card hoverable>
                  <CardHeader>
                    <CardTitle size="sm">Card Example</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-gray-600">
                      Cards are used to group related content and create visual
                      hierarchy.
                    </p>
                  </CardBody>
                </Card>
                <Card hoverable>
                  <CardHeader>
                    <CardTitle size="sm">Hoverable Card</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p className="text-sm text-gray-600">
                      Hover over this card to see the interactive effect.
                    </p>
                  </CardBody>
                </Card>
              </Grid>
            </section>

            {/* Metrics */}
            <section>
              <H2 className="mb-6">Metrics & Stats</H2>
              <Grid columns={3} gap="md">
                <Metric label="Total Patients" value={1234} size="md" />
                <Metric label="Appointments Today" value={28} size="md" />
                <Metric label="Active Members" value={5678} size="md" />
              </Grid>
            </section>

            {/* Alerts */}
            <section>
              <H2 className="mb-6">Alerts</H2>
              <Stack spacing="md">
                <Alert variant="info">
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is an informational message.
                  </AlertDescription>
                </Alert>
                <Alert variant="success">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your action was completed successfully.
                  </AlertDescription>
                </Alert>
                <Alert variant="warning">
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This requires your attention.
                  </AlertDescription>
                </Alert>
                <Alert variant="error">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again.
                  </AlertDescription>
                </Alert>
              </Stack>
            </section>

            {/* Grid & Layout */}
            <section>
              <H2 className="mb-6">Layout & Spacing</H2>
              <Grid columns={2} gap="md">
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">8-Point Grid System</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <p className="text-sm text-gray-600">
                      All spacing follows an 8-point baseline grid for
                      consistency.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        xs: 0.5rem (8px)
                      </div>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        sm: 1rem (16px)
                      </div>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        md: 1.5rem (24px)
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle size="sm">Responsive Breakpoints</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Mobile-first responsive design.
                    </p>
                    <div className="space-y-2">
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        sm: 640px
                      </div>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        md: 768px
                      </div>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        lg: 1024px
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Grid>
            </section>

            {/* Empty State */}
            <section>
              <H2 className="mb-6">Empty States</H2>
              <Card>
                <CardBody>
                  <EmptyState
                    title="No Results Found"
                    description="Try adjusting your search criteria"
                  />
                </CardBody>
              </Card>
            </section>
          </Stack>
        </PageContainer>
      </Main>

      <Footer>
        <Container className="py-8">
          <p className="text-gray-400">
            © 2024 GoodHealth. All rights reserved.
          </p>
        </Container>
      </Footer>
    </Layout>
  );
}
