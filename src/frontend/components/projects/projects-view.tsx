"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Badge from "@/frontend/components/ui/badge";
import Button from "@/frontend/components/ui/button";
import { inputClasses } from "@/frontend/components/ui/field";
import {
  EmptyState,
  ErrorState,
  PageSkeleton,
} from "@/frontend/components/ui/states";
import CreateProjectModal from "./create-project-modal";
import { useCurrentUser } from "@/frontend/context/current-user";
import { useResource } from "@/frontend/lib/use-resource";
import { formatLabel } from "@/frontend/lib/format";
import { listProjects } from "@/frontend/services/project-services";
import type { ProjectStatus } from "@/frontend/types/project";

const statusFilters: Array<ProjectStatus | "all"> = [
  "all",
  "planning",
  "active",
  "completed",
  "archived",
];

const statusAccent: Record<ProjectStatus, string> = {
  planning: "bg-violet-500",
  active: "bg-sky-500",
  completed: "bg-emerald-500",
  archived: "bg-gray-300",
};

export default function ProjectsView() {
  const user = useCurrentUser();
  const canCreate = user.role === "owner" || user.role === "admin";
  const {
    data: projects,
    error,
    reload,
  } = useResource(listProjects, "projects");
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const visibleProjects = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (projects ?? []).filter(
      (project) =>
        (filter === "all" || project.status === filter) &&
        project.name.toLowerCase().includes(search),
    );
  }, [projects, filter, query]);

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!projects) return <PageSkeleton label="Loading projects" />;

  const countFor = (status: ProjectStatus | "all") =>
    status === "all"
      ? projects.length
      : projects.filter((project) => project.status === status).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Projects
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            {user.role === "owner"
              ? "Every project in your workspace."
              : "Projects you're a member of."}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="M12 5v14M5 12h14" />
            </svg>
            New project
          </Button>
        )}
      </section>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description={
            canCreate
              ? "Create your first project to start planning work with your team."
              : "You haven't been added to any projects yet. Ask a project manager to add you."
          }
          action={
            canCreate && (
              <Button onClick={() => setIsCreateOpen(true)}>New project</Button>
            )
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Filter by status"
              className="flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1"
            >
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  role="tab"
                  aria-selected={filter === status}
                  onClick={() => setFilter(status)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-indigo-600 ${filter === status ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {status === "all" ? "All" : formatLabel(status)}
                  <span className="text-xs tabular-nums text-gray-400">
                    {countFor(status)}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative lg:w-72">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path strokeLinecap="round" d="m20 20-4-4" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects"
                aria-label="Search projects"
                className={`${inputClasses} h-10 pl-9`}
              />
            </div>
          </div>

          {visibleProjects.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md hover:shadow-gray-900/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 top-0 h-1 ${statusAccent[project.status]}`}
                    />
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-sm font-semibold text-gray-700 ring-1 ring-gray-200">
                        {project.name.trim().charAt(0).toUpperCase()}
                      </span>
                      <Badge value={project.status} withDot />
                    </div>
                    <h3 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-medium text-indigo-600">
                      Open project
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4 transition group-hover:translate-x-0.5"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 10h11m-4-4 4 4-4 4"
                        />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-gray-200 bg-white px-5 py-10 text-center text-sm text-gray-500">
              No projects match your filters.
            </p>
          )}
        </>
      )}

      {canCreate && (
        <CreateProjectModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}
