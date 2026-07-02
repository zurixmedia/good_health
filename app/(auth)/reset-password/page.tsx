"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { isClerkError } from "@/components/auth/clerk-errors";

function ResetPasswordForm() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") || "";

  const [email] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // Ensure we have an identifier tied to the sign-in attempt.
      // The reset flow was initiated on the forgot-password page,
      // but if the user landed here directly we re-create it.
      if (!signIn.identifier && email) {
        const { error: createError } = await signIn.create({
          identifier: email,
        });
        if (createError) {
          setError(isClerkError(createError));
          setLoading(false);
          return;
        }
      }

      // 1. Verify the code sent to the user's email.
      const { error: verifyError } =
        await signIn.resetPasswordEmailCode.verifyCode({ code });

      if (verifyError) {
        setError(isClerkError(verifyError));
        setLoading(false);
        return;
      }

      // 2. Submit the new password. Status becomes 'complete'.
      const { error: submitError } =
        await signIn.resetPasswordEmailCode.submitPassword({
          password: newPassword,
        });

      if (submitError) {
        setError(isClerkError(submitError));
        setLoading(false);
        return;
      }

      // 3. Finalize the session.
      if (signIn.status === "complete") {
        await signIn.finalize();
      }
      router.push("/login");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please request a new code."
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

      <div className="space-y-1.5">
        <label
          htmlFor="newPassword"
          className="block text-sm font-semibold text-slate-700"
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Create a new password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40 focus:border-[#0ea5e9] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-slate-700"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40 focus:border-[#0ea5e9] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirm ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isBusy || !code || !newPassword || !confirmPassword}
        className="w-full h-12 rounded-full bg-[#0ea5e9] text-base font-semibold text-white shadow-md hover:bg-[#0284c7] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isBusy && <Loader2 className="h-5 w-5 animate-spin" />}
        {isBusy ? "Resetting..." : "Reset Password"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Remember your password?{" "}
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

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter the verification code from your email and choose a new password."
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
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
