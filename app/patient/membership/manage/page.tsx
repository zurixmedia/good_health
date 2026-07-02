"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
  H2,
  Body,
  Stack,
  Grid,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Flex,
  EmptyState,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout";
import { MembershipStatus, MembershipHistory } from "@/components/memberships";
import {
  getPatientActiveMembership,
  getPatientMemberships,
  cancelMembershipSubscription,
  renewMembershipSubscription,
  updateAutoRenew,
} from "@/actions/memberships";
import { useTransition } from "react";

type ActiveMembership = Awaited<ReturnType<typeof getPatientActiveMembership>>;
type MembershipHistoryItem = Awaited<ReturnType<typeof getPatientMemberships>>[number];

export default function MembershipManagementPage() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeMembership, setActiveMembership] =
    React.useState<ActiveMembership>(null);
  const [allMemberships, setAllMemberships] = React.useState<
    MembershipHistoryItem[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const isInitialLoading = !isLoaded || loading;

  // The server actions resolve the patient identity from the session, so no
  // user id is threaded through the client.
  const reload = React.useCallback(async () => {
    try {
      setLoading(true);
      const [active, all] = await Promise.all([
        getPatientActiveMembership(),
        getPatientMemberships(),
      ]);
      setActiveMembership(active);
      setAllMemberships(all);
    } catch (error) {
      console.error("Failed to load memberships:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isLoaded) return;
    void reload();
  }, [isLoaded, reload]);

  const handleCancel = (subscriptionId: string) => {
    if (!confirm("Are you sure you want to cancel your membership?")) return;

    startTransition(async () => {
      try {
        await cancelMembershipSubscription(subscriptionId);
        await reload();
      } catch (error) {
        console.error("Failed to cancel membership:", error);
      }
    });
  };

  const handleRenew = (subscriptionId: string) => {
    startTransition(async () => {
      try {
        await renewMembershipSubscription(subscriptionId);
        await reload();
      } catch (error) {
        console.error("Failed to renew membership:", error);
      }
    });
  };

  const handleAutoRenewToggle = (
    subscriptionId: string,
    currentValue: boolean,
  ) => {
    startTransition(async () => {
      try {
        await updateAutoRenew(subscriptionId, !currentValue);
        await reload();
      } catch (error) {
        console.error("Failed to update auto-renew:", error);
      }
    });
  };

  if (isInitialLoading) {
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
        <Navbar logo={<h1 className="text-xl font-bold">GoodHealth</h1>} />
      </Header>

      <Main>
        <PageContainer className="py-12">
          <Stack spacing="xl">
            {/* Header */}
            <Flex justify="between" align="center">
              <div>
                <H1>Membership Management</H1>
                <Body muted className="mt-2">
                  View and manage your membership subscription
                </Body>
              </div>
              <Button onClick={() => router.push("/patient/membership")}>
                Browse Plans
              </Button>
            </Flex>

            {/* Current Membership */}
            {activeMembership ? (
              <div className="space-y-6">
                <MembershipStatus subscription={activeMembership} />

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Actions</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Grid columns={2} gap="md">
                      <div>
                        <p className="text-sm text-gray-600 mb-3">
                          Auto Renewal
                        </p>
                        <Button
                          variant={
                            activeMembership.autoRenew ? "default" : "outline"
                          }
                          onClick={() =>
                            handleAutoRenewToggle(
                              activeMembership.id,
                              activeMembership.autoRenew,
                            )
                          }
                          disabled={isPending}
                          className="w-full"
                        >
                          {activeMembership.autoRenew
                            ? "Enabled"
                            : "Enable Auto Renewal"}
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Renewal</p>
                        <Button
                          onClick={() => handleRenew(activeMembership.id)}
                          disabled={isPending}
                          className="w-full"
                        >
                          Renew Now
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">
                          Upgrade Plan
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => router.push("/patient/membership")}
                          className="w-full"
                        >
                          Change Plan
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Cancel</p>
                        <Button
                          variant="destructive"
                          onClick={() => handleCancel(activeMembership.id)}
                          disabled={isPending}
                          className="w-full"
                        >
                          Cancel Membership
                        </Button>
                      </div>
                    </Grid>
                  </CardBody>
                </Card>
              </div>
            ) : (
              <EmptyState
                title="No Active Membership"
                description="You don't have an active membership. Browse our plans to get started."
                action={
                  <Button onClick={() => router.push("/patient/membership")}>
                    View Plans
                  </Button>
                }
              />
            )}

            {/* Membership History */}
            {allMemberships.length > 0 && (
              <div>
                <H2>Membership History</H2>
                <MembershipHistory subscriptions={allMemberships} />
              </div>
            )}
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
