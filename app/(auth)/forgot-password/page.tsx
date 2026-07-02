"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { isClerkError } from "@/components/auth/clerk-errors";

export default function ForgotPasswordPage() {
  const { signIn, fetchStatus } = useSignIn();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setError("");
    setLoading(true);

    try {
      // Start the sign-in flow with the identifier, then trigger the
      // password reset email code flow for that account.
      const { error: createError } = await signIn.create({
        identifier: email,
      });

      if (createError) {
        setError(isClerkError(createError));
        setLoading(false);
        return;
      }

      const { error: sendError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendError) {
        setError(isClerkError(sendError));
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || fetchStatus === "fetching";

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you a code to reset your password."
      backLabel="Back to Sign In"
      backHref="/login"
    >
      {success ? (
        <div className="space-y-6">
          <div className="rounded-xl bg-green-50 border border-green-200 px-5 py-4 text-sm text-green-800">
            <p className="font-semibold mb-1">Check your email</p>
            <p>
              We&apos;ve sent a password reset code to{" "}
              <span className="font-semibold">{email}</span>. Use it on the
              reset password page to choose a new password.
            </p>
          </div>
          <Link
            href={`/reset-password?email=${encodeURIComponent(email)}`}
            className="w-full h-12 rounded-full bg-[#0ea5e9] text-base font-semibold text-white shadow-md hover:bg-[#0284c7] hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Reset Password
          </Link>
          <p className="text-center text-sm text-slate-500">
            Didn&apos;t receive an email?{" "}
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
            >
              Try again
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40 focus:border-[#0ea5e9] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isBusy || !email}
            className="w-full h-12 rounded-full bg-[#0ea5e9] text-base font-semibold text-white shadow-md hover:bg-[#0284c7] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isBusy && <Loader2 className="h-5 w-5 animate-spin" />}
            {isBusy ? "Sending..." : "Send Reset Code"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
            >
              Create Account
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
