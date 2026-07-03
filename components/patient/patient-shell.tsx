import "server-only";

import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/guards";
import { UserRole } from "@/app/generated/prisma/enums";
import { PatientShellClient } from "./patient-shell-client";

export { PatientShellClient };
export type { PatientUser } from "./patient-shell-client";

/**
 * Server-component shell shared by every patient page.
 *
 * Resolves the signed-in patient's display identity once (so each page does not
 * need to thread it through) and renders the Figma sidebar + topbar chrome via
 * the client component. Children render inside the main content area.
 */
export async function PatientShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const authUser = await requireRole([UserRole.PATIENT]);

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      profileImageUrl: true,
    },
  });

  return (
    <PatientShellClient
      user={
        user ?? {
          firstName: "Patient",
          lastName: "",
          email: authUser.email,
          profileImageUrl: null,
        }
      }
      title={title}
    >
      {children}
    </PatientShellClient>
  );
}
