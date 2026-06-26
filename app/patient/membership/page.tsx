"use client";

import { useState } from "react";
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
  CardTitle,
  EmptyState,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/shared";
import { Navbar } from "@/components/layout";
import {
  MembershipPlanGrid,
  BillingPeriodToggle,
} from "@/components/memberships";
import { getMembershipPlans } from "@/actions/memberships";
import { useRouter } from "next/navigation";
import React from "react";

type MembershipPlan = Awaited<ReturnType<typeof getMembershipPlans>>[number];

export default function MembershipBrowsePage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [plans, setPlans] = React.useState<MembershipPlan[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getMembershipPlans();
        setPlans(data);
      } catch (error) {
        console.error("Failed to load plans:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleSelectPlan = async (
    planId: string,
    period: "monthly" | "yearly",
  ) => {
    // Navigate to checkout
    router.push(`/patient/membership/${planId}/checkout?period=${period}`);
  };

  return (
    <Layout>
      <Header>
        <Navbar logo={<h1 className="text-xl font-bold">GoodHealth</h1>} />
      </Header>

      <Main>
        <PageContainer className="py-12">
          <Stack spacing="xl">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
              <H1 className="mb-4">Choose Your Membership Plan</H1>
              <Body muted>
                Gain unlimited access to our network of qualified healthcare
                professionals. Choose the plan that works best for you.
              </Body>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center">
              <BillingPeriodToggle
                period={billingPeriod}
                onChange={setBillingPeriod}
              />
            </div>

            {/* Alert */}
            <Alert variant="info">
              <AlertTitle>Flexible Plans</AlertTitle>
              <AlertDescription>
                All plans include access to our doctor directory, health
                records, and member support. You can change or cancel anytime.
              </AlertDescription>
            </Alert>

            {/* Plans Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading membership plans...</p>
              </div>
            ) : plans.length > 0 ? (
              <MembershipPlanGrid
                plans={plans}
                billingPeriod={billingPeriod}
                onSelectPlan={handleSelectPlan}
              />
            ) : (
              <EmptyState
                title="No Plans Available"
                description="Membership plans are currently unavailable. Please try again later."
              />
            )}

            {/* Features Section */}
            <div className="pt-12 border-t border-gray-200">
              <H2 className="mb-8 text-center">What&apos;s Included</H2>
              <Grid columns={3} gap="md">
                <Card>
                  <CardBody>
                    <div className="text-4xl mb-4">👨‍⚕️</div>
                    <CardTitle size="sm">Doctor Network</CardTitle>
                    <Body size="sm" muted className="mt-2">
                      Access to verified healthcare professionals across all
                      specializations
                    </Body>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div className="text-4xl mb-4">📱</div>
                    <CardTitle size="sm">Video Consultations</CardTitle>
                    <Body size="sm" muted className="mt-2">
                      Consult with doctors from the comfort of your home via
                      secure video calls
                    </Body>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <div className="text-4xl mb-4">📋</div>
                    <CardTitle size="sm">Health Records</CardTitle>
                    <Body size="sm" muted className="mt-2">
                      Maintain and organize your complete health history in one
                      secure place
                    </Body>
                  </CardBody>
                </Card>
              </Grid>
            </div>

            {/* FAQ Section */}
            <div className="pt-12 border-t border-gray-200">
              <H2 className="mb-8 text-center">Frequently Asked Questions</H2>
              <div className="max-w-2xl mx-auto space-y-4">
                <FAQItem
                  question="Can I change my plan later?"
                  answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
                />
                <FAQItem
                  question="Can I cancel my membership?"
                  answer="Absolutely. You can cancel anytime from your account settings. No hidden fees or penalties."
                />
                <FAQItem
                  question="What payment methods do you accept?"
                  answer="We accept all major credit cards, debit cards, and digital payment methods."
                />
                <FAQItem
                  question="Is my data secure?"
                  answer="Yes, we use industry-leading encryption and comply with all healthcare data protection regulations."
                />
              </div>
            </div>
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardBody>
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left flex justify-between items-center hover:opacity-70 transition"
        >
          <p className="font-semibold text-gray-900">{question}</p>
          <span className="text-gray-600">{open ? "−" : "+"}</span>
        </button>
        {open && <p className="mt-4 text-gray-600 text-sm">{answer}</p>}
      </CardBody>
    </Card>
  );
}
