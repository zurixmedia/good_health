"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, UserRound, Stethoscope } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { isClerkError } from "@/components/auth/clerk-errors";

type Role = "patient" | "doctor";

/* ────────────────────────────────────────────
   Role selection card component
   ──────────────────────────────────────────── */
interface RoleCardProps {
  role: Role;
  selected: boolean;
  onSelect: (role: Role) => void;
}

function RoleCard({ role, selected, onSelect }: RoleCardProps) {
  const isPatient = role === "patient";

  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      className={`w-full rounded-2xl p-5 sm:p-6 border-2 transition-all text-left space-y-3 ${
        selected
          ? "border-[#0ea5e9] bg-sky-50/80 shadow-md shadow-sky-500/10"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center transition-colors ${
            selected ? "bg-[#0ea5e9] text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {isPatient ? (
            <UserRound className="h-6 w-6 sm:h-7 sm:w-7" />
          ) : (
            <Stethoscope className="h-6 w-6 sm:h-7 sm:w-7" />
          )}
        </div>
        <div
          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
            selected ? "border-[#0ea5e9] bg-[#0ea5e9]" : "border-slate-300"
          }`}
          aria-hidden="true"
        >
          {selected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          {isPatient ? "Patient" : "Doctor"}
        </h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          {isPatient
            ? "Book appointments, manage your health, and access virtual consultations"
            : "Manage patients, schedule appointments, and provide virtual care"}
        </p>
      </div>
    </button>
  );
}

/* ────────────────────────────────────────────
   Shared input field styling
   ──────────────────────────────────────────── */
const inputClass =
  "w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40 focus:border-[#0ea5e9] transition-all";
const passwordInputClass =
  "w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40 focus:border-[#0ea5e9] transition-all";

/* ────────────────────────────────────────────
   Main Sign Up page
   ──────────────────────────────────────────── */
function SignUpForm() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get("role") as Role | null;

  const [step, setStep] = useState<1 | 2>(preselectedRole ? 2 : 1);
  const [role, setRole] = useState<Role | null>(preselectedRole);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setError("");
    setStep(2);
  };

  const handleBackToRoles = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Register] Submit button clicked");

    if (!signUp) {
      console.error("[Register] signUp object is missing/not loaded");
      return;
    }
    if (!role) {
      console.error("[Register] role selection is missing");
      return;
    }

    setError("");

    if (password !== confirmPassword) {
      console.log("[Register] Validation failed: password mismatch");
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      console.log("[Register] Validation failed: password too short");
      setError("Password must be at least 8 characters.");
      return;
    }

    console.log("[Register] Form validation passed. Setting loading = true");
    setLoading(true);

    try {
      console.log("[Register] Calling signUp.create() with fields: ", {
        firstName,
        lastName,
        email,
        role,
      });
      // Step 1: Create the sign-up with user details
      const createRes = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        unsafeMetadata: { role },
      });
      console.log("[Register] signUp.create() response: ", createRes);

      const createError = createRes?.error;
      if (createError) {
        console.error("[Register] signUp.create() returned error: ", createError);
        setError(isClerkError(createError));
        setLoading(false);
        return;
      }

      console.log("[Register] Calling signUp.verifications.sendEmailCode()");
      // Step 2: Trigger email verification via the v7 verifications API
      const sendRes = await signUp.verifications.sendEmailCode();
      console.log("[Register] signUp.verifications.sendEmailCode() response: ", sendRes);

      const verifyError = sendRes?.error;
      if (verifyError) {
        console.error("[Register] sendEmailCode() returned error: ", verifyError);
        setError(isClerkError(verifyError));
        setLoading(false);
        return;
      }

      const redirectUrl = `/verify-email?email=${encodeURIComponent(email)}&role=${role}`;
      console.log("[Register] Registration successful, redirecting to: ", redirectUrl);
      router.push(redirectUrl);
    } catch (err: unknown) {
      console.error("[Register] Caught exception in handleSubmit: ", err);
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
      setLoading(false);
    }
  };

  const isBusy = loading || fetchStatus === "fetching";

  /* ──────── Step 1: Role Selection ──────── */
  if (step === 1) {
    return (
      <AuthLayout
        title="Create an Account"
        subtitle="Choose how you'd like to use GoodHealth"
      >
        <div className="space-y-5">
          <div className="grid gap-4">
            <RoleCard
              role="patient"
              selected={role === "patient"}
              onSelect={handleRoleSelect}
            />
            <RoleCard
              role="doctor"
              selected={role === "doctor"}
              onSelect={handleRoleSelect}
            />
          </div>

          <p className="text-center text-sm text-slate-500 pt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  /* ──────── Step 2: Registration Form ──────── */
  return (
    <AuthLayout
      title={
        role === "patient" ? "Patient Registration" : "Doctor Registration"
      }
      subtitle="Fill in your details to create your account"
      backLabel="Back to Role Selection"
      backHref="#"
      backOnClick={handleBackToRoles}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-slate-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              autoComplete="given-name"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-slate-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              autoComplete="family-name"
              className={inputClass}
            />
          </div>
        </div>

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
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-slate-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 800 000 0000"
            autoComplete="tel"
            className={inputClass}
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
              placeholder="Create a password"
              required
              minLength={8}
              autoComplete="new-password"
              className={passwordInputClass}
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-slate-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={8}
              autoComplete="new-password"
              className={passwordInputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
        
        {/* CAPTCHA Container */}
        <div id="clerk-captcha" />

        {/* Submit */}
        <button
          type="submit"
          disabled={
            isBusy ||
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
          }
          className="w-full h-12 rounded-full bg-[#0ea5e9] text-base font-semibold text-white shadow-md shadow-sky-500/25 hover:bg-[#0284c7] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isBusy && <Loader2 className="h-5 w-5 animate-spin" />}
          {isBusy ? "Creating Account..." : "Create Account"}
        </button>

        {/* Footer link */}
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
    </AuthLayout>
  );
}

/**
 * Page entry point. `useSearchParams()` is used inside `SignUpForm`, so it must
 * be wrapped in a Suspense boundary — otherwise Next.js 16 fails the build with
 * "useSearchParams() should be wrapped in a suspense boundary". The fallback
 * mirrors the loader used by the other auth pages.
 */
export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[#0ea5e9]" />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
