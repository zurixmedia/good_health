import { UserRole } from "@/app/generated/prisma/enums";
import { requireRole } from "@/lib/auth/guards";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole([UserRole.ADMIN]);

  return children;
}
