import { notFound } from "next/navigation";
import ProjectView from "@/frontend/components/projects/project-view";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    notFound();
  }
  return <ProjectView projectId={projectId} />;
}
