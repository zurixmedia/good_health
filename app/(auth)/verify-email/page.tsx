"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { isClerkError } from "@/components/auth/clerk-errors";
import { resolvePostAuthRedirectPath } from "@/lib/auth/redirects";

function VerifyEmailForm() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const roleHint = searchParams.get("role");

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[VerifyEmail] Submit button clicked");

    if (!signUp) {
      console.error("[VerifyEmail] signUp object is missing/not loaded");
      return;
    }

    setError("");
    console.log("[VerifyEmail] Setting loading = true. Code entered: ", code);
    setLoading(true);

    try {
      console.log("[VerifyEmail] Calling signUp.verifications.verifyEmailCode() with code: ", code);
      // Submit the 6-digit code from the user's inbox. On the v7 Future API
      // this resolves the sign-up to status "complete".
      const verifyRes = await signUp.verifications.verifyEmailCode({ code });
      console.log("[VerifyEmail] verifyEmailCode() response: ", verifyRes);

      const verifyError = verifyRes?.error;
      if (verifyError) {
        console.error("[VerifyEmail] verifyEmailCode() returned error: ", verifyError);
        setError(isClerkError(verifyError));
        setLoading(false);
        return;
      }

      console.log("[VerifyEmail] Current signUp status: ", signUp.status);
      if (signUp.status === "complete") {
        console.log("[VerifyEmail] Sign-up complete! Calling signUp.finalize()");
        // Convert the completed sign-up into an active session. This is what
        // makes the Clerk session cookie available to the immediate redirect.
        const finalizeRes = await signUp.finalize();
        console.log("[VerifyEmail] signUp.finalize() completed: ", finalizeRes);

        console.log("[VerifyEmail] Resolving post-auth redirect path for roleHint: ", roleHint);
        const destination = await resolvePostAuthRedirectPath(roleHint);
        console.log("[VerifyEmail] Redirecting to destination: ", destination);
        router.push(destination);
        return;
      }

      console.warn("[VerifyEmail] Sign-up status is not complete yet: ", signUp.status);
      setError(
        "Additional verification is required. Please complete it in your dashboard.",
      );
      setLoading(false);
    } catch (err: unknown) {
      console.error("[VerifyEmail] Caught exception in handleSubmit: ", err);
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please request a new code.",
      );
      setLoading(false);
    }
  };

  const isBusy = loading || fetchStatus === "fetching";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-sm text-slate-600 leading-relaxed">
        We&apos;ve sent a verification code
        {email ? (
          <>
            {" "}
            to <span className="font-semibold text-slate-800">{email}</span>
          </>
        ) : null}
        . Enter it below to activate your account.
      </p>

      <div className="space-y-1.5">
        <label
          htmlFor="code"
          className="block text-sm font-semibold text-slate-700"
        >
          Verification Code
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code from email"
          required
          className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40 focus:border-[#0ea5e9] transition-all tracking-widest"
        />
      </div>

      <button
        type="submit"
        disabled={isBusy || !code}
        className="w-full h-12 rounded-full bg-[#0ea5e9] text-base font-semibold text-white shadow-md shadow-sky-500/25 hover:bg-[#0284c7] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isBusy && <Loader2 className="h-5 w-5 animate-spin" />}
        {isBusy ? "Verifying..." : "Verify Email"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the code we sent to your email to continue."
      backLabel="Back to Sign In"
      backHref="/login"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#0ea5e9]" />
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}
