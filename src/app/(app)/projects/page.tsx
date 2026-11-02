import { ProjectsView } from "@/frontend/components/projects/projects-view";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: openNew } = await searchParams;
  return <ProjectsView openNew={openNew === "1"} />;
}
