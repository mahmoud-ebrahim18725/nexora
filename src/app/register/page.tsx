import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/auth";
import AuthLayout from "@/frontend/components/auth/auth-layout";
import RegisterForm from "@/frontend/components/auth/register-form";

export default async function Register() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <AuthLayout
      headline={
        <>
          Bring your team
          <br />
          into one
          <br />
          shared workspace.
        </>
      }
      tagline="Create projects, assign work, and see progress across your company from day one."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
