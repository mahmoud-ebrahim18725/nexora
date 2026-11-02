import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/auth";
import { AuthTabs } from "@/frontend/components/auth/auth-tabs";
import { RegisterForm } from "@/frontend/components/auth/register-form";

export default async function RegisterPage() {
  if (await getCurrentUser()) {
    redirect("/dashboard");
  }
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create your workspace</h1>
        <p className="mt-1 text-muted">Set up your company and invite your team.</p>
      </div>
      <AuthTabs active="/register" />
      <RegisterForm />
    </>
  );
}
