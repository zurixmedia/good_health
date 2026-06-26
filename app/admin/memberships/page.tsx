"use client";

import React from "react";
import {
  Layout,
  Header,
  Main,
  Footer,
  PageContainer,
  Container,
} from "@/components/layout";
import {
  H1,
  Body,
  Stack,
  Grid,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Flex,
  Metric,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout";
import { getMembershipStats, getMembershipPlans } from "@/actions/memberships";
import { useRouter } from "next/navigation";

type MembershipStats = Awaited<ReturnType<typeof getMembershipStats>>;
type MembershipPlan = Awaited<ReturnType<typeof getMembershipPlans>>[number];

export default function AdminMembershipDashboard() {
  const router = useRouter();
  const [stats, setStats] = React.useState<MembershipStats | null>(null);
  const [plans, setPlans] = React.useState<MembershipPlan[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [statsData, plansData] = await Promise.all([
          getMembershipStats(),
          getMembershipPlans(),
        ]);
        setStats(statsData);
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Header>
          <Navbar logo={<h1 className="text-xl font-bold">GoodHealth</h1>} />
        </Header>
        <Main>
          <PageContainer className="py-12">
            <p className="text-center text-gray-600">Loading...</p>
          </PageContainer>
        </Main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header>
        <Navbar
          logo={<h1 className="text-xl font-bold">GoodHealth Admin</h1>}
        />
      </Header>

      <Main>
        <PageContainer className="py-12">
          <Stack spacing="xl">
            <Flex justify="between" align="center">
              <H1>Membership Management</H1>
              <Button onClick={() => router.push("/admin/memberships/create")}>
                New Plan
              </Button>
            </Flex>

            {/* Stats */}
            {stats && (
              <Grid columns={4} gap="md">
                <Metric label="Total Plans" value={stats.totalPlans} />
                <Metric label="Active Plans" value={stats.activePlans} />
                <Metric
                  label="Active Subscriptions"
                  value={stats.activeSubscriptions}
                />
                <Metric
                  label="Expired Subscriptions"
                  value={stats.expiredSubscriptions}
                />
              </Grid>
            )}

            {/* Plans Table */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Plans</CardTitle>
              </CardHeader>
              <CardBody>
                {plans.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Plan Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Monthly
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Yearly
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Consultations
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((plan) => (
                          <tr
                            key={plan.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">
                                {plan.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {plan.description}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              ${plan.monthlyPrice.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              {plan.yearlyPrice
                                ? `$${plan.yearlyPrice.toFixed(2)}`
                                : "-"}
                            </td>
                            <td className="py-3 px-4">
                              {plan.consultationLimit || "Unlimited"}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  plan.isActive
                                    ? "bg-green-100 text-green-900"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                {plan.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(
                                    `/admin/memberships/${plan.id}/edit`,
                                  )
                                }
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Body muted>No membership plans available</Body>
                )}
              </CardBody>
            </Card>
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
