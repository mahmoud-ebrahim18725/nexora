"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/frontend/components/ui/avatar";
import Badge from "@/frontend/components/ui/badge";
import Button from "@/frontend/components/ui/button";
import ConfirmDialog from "@/frontend/components/ui/confirm-dialog";
import { ErrorState, PageSkeleton } from "@/frontend/components/ui/states";
import EditProjectModal from "./edit-project-modal";
import ProjectMembers from "./project-members";
import TaskBoard from "./task-board";
import TaskDrawer from "./task-drawer";
import TaskFormModal from "./task-form-modal";
import { useCurrentUser } from "@/frontend/context/current-user";
import { isOverdue } from "@/frontend/lib/format";
import { useResource } from "@/frontend/lib/use-resource";
import {
  deleteProject,
  getProject,
  listProjectMembers,
} from "@/frontend/services/project-services";
import { deleteTask, listTasks } from "@/frontend/services/task-services";
import type { Task } from "@/frontend/types/task";

type Tab = "board" | "members";

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | number;
  tone?: "default" | "danger";
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold tabular-nums ${tone === "danger" ? "text-red-600" : "text-gray-900"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function ProjectView({ projectId }: { projectId: number }) {
  const user = useCurrentUser();
  const router = useRouter();
  const project = useResource(
    () => getProject(projectId),
    `project-${projectId}`,
  );
  const members = useResource(
    () => listProjectMembers(projectId),
    `members-${projectId}`,
  );
  const tasks = useResource(() => listTasks(projectId), `tasks-${projectId}`);

  const [tab, setTab] = useState<Tab>("board");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskForm, setTaskForm] = useState<{ task?: Task } | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const reloadProject = project.reload;
  const reloadTasks = tasks.reload;
  const reloadMembers = members.reload;
  const refreshTasks = useCallback(() => {
    reloadTasks();
    reloadProject();
  }, [reloadTasks, reloadProject]);
  const refreshMembers = useCallback(() => {
    reloadMembers();
    reloadProject();
  }, [reloadMembers, reloadProject]);

  const isModalOpen =
    isEditOpen || isDeleteOpen || Boolean(taskForm || taskToDelete);
  const closeDrawer = useCallback(() => {
    if (!isModalOpen) setSelectedTaskId(null);
  }, [isModalOpen]);

  const error = project.error ?? members.error ?? tasks.error;
  if (error) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          error={error}
          onRetry={() => {
            project.reload();
            members.reload();
            tasks.reload();
          }}
        />
      </div>
    );
  }
  if (!project.data || !members.data || !tasks.data) {
    return <PageSkeleton label="Loading project" />;
  }

  const details = project.data;
  const memberList = members.data;
  const taskList = tasks.data;
  const membership = memberList.find((member) => member.id === user.id);
  const isOwner = user.role === "owner";
  const isManager = membership?.projectRole === "manager";
  const canManage = isOwner || isManager;
  const completed = taskList.filter(
    (task) => task.status === "completed",
  ).length;
  const progress = taskList.length
    ? Math.round((completed / taskList.length) * 100)
    : 0;
  const overdueCount = taskList.filter((task) =>
    isOverdue(task.dueDate, task.status),
  ).length;
  const selectedTask = taskList.find((task) => task.id === selectedTaskId);

  return (
    <div className="space-y-6">
      <BackLink />

      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight break-words text-gray-900">
                {details.name}
              </h2>
              <Badge value={details.status} withDot />
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              {details.description || "No description yet."}
            </p>
          </div>
          {canManage && (
            <div className="flex shrink-0 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                className="hover:text-red-600"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Tasks" value={details.tasksCount} />
          <Stat label="Completed" value={`${progress}%`} />
          <Stat
            label="Overdue"
            value={overdueCount}
            tone={overdueCount > 0 ? "danger" : "default"}
          />
          <div className="rounded-lg bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
            <p className="text-xs font-medium text-gray-500">
              {details.membersCount}{" "}
              {details.membersCount === 1 ? "Member" : "Members"}
            </p>
            <div className="mt-1.5 flex -space-x-1">
              {memberList.slice(0, 5).map((member) => (
                <Avatar
                  key={member.id}
                  name={member.name}
                  id={member.id}
                  size="sm"
                />
              ))}
              {memberList.length > 5 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600 ring-2 ring-white">
                  +{memberList.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-label="Project progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <div
        role="tablist"
        aria-label="Project sections"
        className="flex gap-6 border-b border-gray-200"
      >
        {(["board", "members"] as Tab[]).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={`-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition ${tab === value ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-900"}`}
          >
            {value === "board" ? "Board" : `Members (${memberList.length})`}
          </button>
        ))}
      </div>

      {tab === "board" ? (
        <TaskBoard
          tasks={taskList}
          members={memberList}
          currentUserId={user.id}
          canCreate={canManage}
          onCreate={() => setTaskForm({})}
          onOpenTask={(task) => setSelectedTaskId(task.id)}
        />
      ) : (
        <ProjectMembers
          projectId={projectId}
          members={memberList}
          currentUserId={user.id}
          currentUserRole={user.role}
          isManager={isManager}
          onChanged={refreshMembers}
        />
      )}

      {selectedTask && (
        <TaskDrawer
          projectId={projectId}
          task={selectedTask}
          members={memberList}
          currentUserId={user.id}
          canManage={canManage}
          canComment={isOwner || Boolean(membership)}
          onClose={closeDrawer}
          onEdit={() => setTaskForm({ task: selectedTask })}
          onDelete={() => setTaskToDelete(selectedTask)}
          onChanged={refreshTasks}
        />
      )}
      {taskForm && (
        <TaskFormModal
          projectId={projectId}
          members={memberList}
          task={taskForm.task}
          onClose={() => setTaskForm(null)}
          onSaved={refreshTasks}
        />
      )}
      {isEditOpen && (
        <EditProjectModal
          project={details}
          onClose={() => setIsEditOpen(false)}
          onSaved={reloadProject}
        />
      )}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        title="Delete task"
        description={`"${taskToDelete?.title ?? ""}" and its comments will be permanently deleted.`}
        onConfirm={async () => {
          if (!taskToDelete) return;
          await deleteTask(projectId, taskToDelete.id);
          setSelectedTaskId(null);
          refreshTasks();
        }}
      />
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete project"
        description={`"${details.name}" and all of its tasks, comments, and memberships will be permanently deleted.`}
        confirmLabel="Delete project"
        onConfirm={async () => {
          await deleteProject(projectId);
          router.push("/projects");
        }}
      />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/projects"
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-gray-900"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 10H5m4-4-4 4 4 4"
        />
      </svg>
      All projects
    </Link>
  );
}
