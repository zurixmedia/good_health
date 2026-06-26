import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/register"
      />
    </main>
  );
}
