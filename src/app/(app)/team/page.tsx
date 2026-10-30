import { redirect } from "next/navigation";
import { getCurrentUser } from "@/backend/auth";
import { ROLES } from "@/backend/constants";
import TeamView from "@/frontend/components/team/team-view";

export default async function Team() {
  const user = await getCurrentUser();
  if (user?.role === ROLES.MEMBER) {
    redirect("/dashboard");
  }
  return <TeamView />;
}
