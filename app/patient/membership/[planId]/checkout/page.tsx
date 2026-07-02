"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
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
  Stack,
  Grid,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
  Flex,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout";
import {
  getMembershipPlanById,
  createMembershipSubscription,
} from "@/actions/memberships";
import { useUser } from "@clerk/nextjs";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTransition } from "react";

type MembershipPlan = NonNullable<
  Awaited<ReturnType<typeof getMembershipPlanById>>
>;

export default function MembershipCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();

  const planId = params.planId as string;
  const period = (searchParams.get("period") || "monthly") as
    | "monthly"
    | "yearly";

  const [plan, setPlan] = React.useState<MembershipPlan | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadPlan() {
      try {
        const data = await getMembershipPlanById(planId);
        setPlan(data);
      } catch (err) {
        setError("Failed to load plan details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [planId]);

  const handleSubscribe = () => {
    if (!user?.id) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      try {
        // The server action resolves the PatientProfile.id from the session;
        // never pass a client-supplied patient id.
        await createMembershipSubscription(planId, period);
        router.push("/patient/membership/success");
      } catch (err) {
        setError("Failed to create subscription");
        console.error(err);
      }
    });
  };

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

  if (!plan) {
    return (
      <Layout>
        <Header>
          <Navbar logo={<h1 className="text-xl font-bold">GoodHealth</h1>} />
        </Header>
        <Main>
          <PageContainer className="py-12">
            <Alert variant="error">
              <AlertTitle>Plan Not Found</AlertTitle>
              <AlertDescription>
                The membership plan you&apos;re looking for doesn&apos;t exist.
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </PageContainer>
        </Main>
      </Layout>
    );
  }

  const price =
    period === "yearly" ? plan.yearlyPrice ?? plan.monthlyPrice : plan.monthlyPrice;
  const startDate = new Date();
  const endDate = new Date();
  if (period === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  return (
    <Layout>
      <Header>
        <Navbar logo={<h1 className="text-xl font-bold">GoodHealth</h1>} />
      </Header>

      <Main>
        <PageContainer className="py-12">
          <Stack spacing="xl">
            <div>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-6"
              >
                ← Back to Plans
              </Button>
              <H1>Checkout</H1>
            </div>

            {error && (
              <Alert variant="error">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Grid columns={2} gap="lg">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Plan</p>
                      <p className="font-semibold text-gray-900">{plan.name}</p>
                      {plan.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Billing Period
                      </p>
                      <Badge variant="primary">
                        {period === "yearly" ? "Yearly" : "Monthly"}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Duration</p>
                      <p className="text-sm text-gray-900">
                        {formatDate(startDate)} - {formatDate(endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <Flex justify="between" align="center">
                      <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(Number(price), "USD")}
                        </span>
                    </Flex>
                  </div>

                  <Button
                    onClick={handleSubscribe}
                    disabled={isPending}
                    className="w-full mt-6"
                  >
                    {isPending ? "Processing..." : "Subscribe Now"}
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    By subscribing, you agree to our Terms of Service and
                    Privacy Policy
                  </p>
                </CardBody>
              </Card>

              {/* Plan Details */}
              <Stack spacing="lg">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Features</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    {plan.consultationLimit && (
                      <FeatureItem
                        text={`Up to ${plan.consultationLimit} consultations per month`}
                      />
                    )}
                    {plan.supportsVirtualConsultation && (
                      <FeatureItem text="Video consultations included" />
                    )}
                    <FeatureItem text="Doctor directory access" />
                    <FeatureItem text="24/7 member support" />
                    <FeatureItem text="Health records management" />
                    <FeatureItem text="Appointment scheduling" />
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <FeatureItem text="Encrypted payment processing" />
                    <FeatureItem text="HIPAA compliant" />
                    <FeatureItem text="SSL secure connection" />
                    <FeatureItem text="No hidden fees" />
                  </CardBody>
                </Card>
              </Stack>
            </Grid>
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

function FeatureItem({ text }: { text: string }) {
  return (
    <Flex gap="sm" align="center">
      <span className="text-green-500 font-bold">✓</span>
      <span className="text-sm text-gray-700">{text}</span>
    </Flex>
  );
}
