import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/auth";
import { AuthTabs } from "@/frontend/components/auth/auth-tabs";
import { LoginForm } from "@/frontend/components/auth/login-form";

export default async function LoginPage() {
  if (await getCurrentUser()) {
    redirect("/dashboard");
  }
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-muted">Sign in to your workspace.</p>
      </div>
      <AuthTabs active="/login" />
      <LoginForm />
    </>
  );
}
