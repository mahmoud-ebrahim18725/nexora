import { notFound } from "next/navigation";
import { ProjectView } from "@/frontend/components/projects/project-view";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }
  return <ProjectView id={id} />;
}
