import { getCurrentUser } from "@/backend/auth";
import AuthEntry from "@/frontend/components/auth/auth-entry";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    return <AuthEntry />;
  }

  return redirect("/dashboard");
}
