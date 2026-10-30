import { getCurrentUser } from "@/backend/auth";
import { redirect } from "next/navigation";
import AppShell from "@/frontend/components/app/app-shell";
import { isRole } from "@/backend/constants";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || !isRole(user.role)) {
    redirect("/");
  }
  return (
    <AppShell
      companyName={user.company.name}
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </AppShell>
  );
}
