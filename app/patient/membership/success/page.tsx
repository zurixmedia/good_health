"use client";

import React from "react";
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
  Body,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Stack,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout";

export default function SubscriptionSuccessPage() {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/patient/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Layout>
      <Header>
        <Navbar logo={<h1 className="text-xl font-bold">GoodHealth</h1>} />
      </Header>

      <Main>
        <PageContainer className="py-24">
          <div className="max-w-md mx-auto text-center">
            <Stack spacing="lg" className="items-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Message */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Successful!</CardTitle>
                </CardHeader>
                <CardBody>
                  <Stack spacing="md">
                    <Body>
                      Your membership has been activated. You now have full
                      access to all healthcare services.
                    </Body>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-900">
                        ✓ Membership activated
                        <br />
                        ✓ Confirmation email sent
                        <br />✓ Ready to book appointments
                      </p>
                    </div>

                    <Stack spacing="sm">
                      <Button
                        onClick={() => router.push("/patient/dashboard")}
                        className="w-full"
                      >
                        Go to Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/patient/doctors")}
                        className="w-full"
                      >
                        Browse Doctors
                      </Button>
                    </Stack>

                    <Body size="sm" muted className="text-center">
                      Redirecting to dashboard in 5 seconds...
                    </Body>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </div>
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
