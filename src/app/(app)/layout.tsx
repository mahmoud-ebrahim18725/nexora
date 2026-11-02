import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/auth";
import { isRole } from "@/backend/constants";
import { AppShell } from "@/frontend/components/app/app-shell";
import { CurrentUserProvider } from "@/frontend/context/current-user";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || !isRole(user.role)) {
    redirect("/login");
  }
  return (
    <CurrentUserProvider
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.company.name,
      }}
    >
      <AppShell>{children}</AppShell>
    </CurrentUserProvider>
  );
}
