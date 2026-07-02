"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { isClerkError } from "@/components/auth/clerk-errors";
import { resolvePostAuthRedirectPath } from "@/lib/auth/redirects";

export default function SignInPage() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;

    setError("");
    setLoading(true);

    try {
      const { error: pwdError } = await signIn.password({
        identifier: email,
        password,
      });

      if (pwdError) {
        setError(isClerkError(pwdError));
        setLoading(false);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize();
        // Redirect to the role-correct dashboard. The destination is resolved
        // from the server (via /api/auth/me), never from client input.
        const destination = await resolvePostAuthRedirectPath();
        router.push(destination);
      } else {
        setError(
          "Additional verification is required. Please complete it in your dashboard."
        );
        setLoading(false);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password."
      );
      setLoading(false);
    }
  };

  const isBusy = loading || fetchStatus === "fetching";

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Please sign in to your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Email */}
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

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40 focus:border-[#0ea5e9] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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

        {/* Remember me + Forgot Password row */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9]"
            />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isBusy || !email || !password}
          className="w-full h-12 rounded-full bg-[#0ea5e9] text-base font-semibold text-white shadow-md shadow-sky-500/25 hover:bg-[#0284c7] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isBusy && <Loader2 className="h-5 w-5 animate-spin" />}
          {isBusy ? "Signing In..." : "Sign In"}
        </button>

        {/* Footer link */}
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
    </AuthLayout>
  );
}
