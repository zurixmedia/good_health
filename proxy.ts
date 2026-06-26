import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/patient(.*)",
  "/doctor(.*)",
  "/admin(.*)",
  "/api/auth/me(.*)",
  "/api/memberships/subscribe(.*)",
  "/api/memberships/current(.*)",
  "/api/appointments(.*)",
  "/api/consultations(.*)",
  "/api/reviews(.*)",
  "/api/notifications(.*)",
  "/api/uploads(.*)",
  "/api/doctor(.*)",
  "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
}, {
  signInUrl: "/login",
  signUpUrl: "/register",
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
