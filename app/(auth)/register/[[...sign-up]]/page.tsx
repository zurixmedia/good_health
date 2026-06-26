import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <SignUp
        path="/register"
        routing="path"
        signInUrl="/login"
      />
    </main>
  );
}
