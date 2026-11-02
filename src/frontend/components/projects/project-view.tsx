"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useCurrentUser } from "../../context/current-user";
import { useResource } from "../../lib/use-resource";
import {
  deleteProject,
  getProject,
  listProjectMembers,
} from "../../services/project-services";
import { deleteTask, listTasks } from "../../services/task-services";
import { Avatar, avatarColor } from "../ui/avatar";
import { ProjectStatusBadge } from "../ui/badge";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { PageHeader } from "../ui/page-header";
import { PlusIcon } from "../ui/icons";
import { EmptyState, ErrorState, LoadingState } from "../ui/states";
import { ProjectFormModal } from "./project-form-modal";
import { ProjectMembersModal } from "./project-members-modal";
import { TaskBoard } from "./task-board";
import { TaskDrawer } from "./task-drawer";
import { TaskFormModal } from "./task-form-modal";

type Dialog =
  | "members"
  | "add-member"
  | "edit-project"
  | "delete-project"
  | "new-task"
  | "edit-task"
  | "delete-task";

export function ProjectView({ id }: { id: number }) {
  const router = useRouter();
  const user = useCurrentUser();
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);

  const project = useResource(useCallback(() => getProject(id), [id]));
  const members = useResource(useCallback(() => listProjectMembers(id), [id]));
  const tasks = useResource(useCallback(() => listTasks(id), [id]));

  const reloadProject = project.reload;
  const reloadTasks = tasks.reload;
  const refresh = useCallback(() => {
    reloadProject();
    reloadTasks();
  }, [reloadProject, reloadTasks]);

  const membership = members.data?.find((member) => member.id === user.id);
  const canManage = user.role === "owner" || membership?.projectRole === "manager";
  const openTask = useMemo(
    () => tasks.data?.find((task) => task.id === openTaskId) ?? null,
    [tasks.data, openTaskId],
  );
  const closeDialog = () => setDialog(null);

  const failure = project.error ?? members.error ?? tasks.error;
  if (failure) {
    return (
      <ErrorState
        message={failure.message}
        onRetry={() => {
          refresh();
          members.reload();
        }}
      />
    );
  }
  if (!project.data || !members.data || !tasks.data) {
    return <LoadingState />;
  }

  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <Link
              href="/projects"
              className="underline max-md:inline-flex max-md:min-h-11 max-md:items-center"
            >
              Projects
            </Link>{" "}
            / {project.data.name}
          </>
        }
        title={
          <span className="flex flex-wrap items-center gap-3">
            <span className="min-w-0 break-words">{project.data.name}</span>
            <ProjectStatusBadge status={project.data.status} />
          </span>
        }
      >
        <button
          type="button"
          aria-label={`Manage ${members.data.length} members`}
          onClick={() => setDialog("members")}
          className="flex min-h-11 items-center rounded-lg px-1"
        >
          {members.data.slice(0, 3).map((member) => (
            <Avatar
              key={member.id}
              name={member.name}
              className={`-ml-2 ring-2 ring-ground first:ml-0 ${avatarColor(member.name)}`}
            />
          ))}
          {members.data.length > 3 && (
            <span className="-ml-2 flex size-9 items-center justify-center rounded-full bg-line text-[13px] font-semibold ring-2 ring-ground">
              +{members.data.length - 3}
            </span>
          )}
        </button>
        {canManage && (
          <>
            <Button variant="secondary" onClick={() => setDialog("add-member")}>
              Add member
            </Button>
            <Button variant="secondary" onClick={() => setDialog("edit-project")}>
              Edit
            </Button>
            <Button
              aria-label="New task"
              className="shadow-lg max-md:fixed max-md:right-4 max-md:bottom-[max(1rem,env(safe-area-inset-bottom))] max-md:z-10 max-md:min-h-14 max-md:rounded-full max-md:px-5 md:shadow-none"
              onClick={() => setDialog("new-task")}
            >
              <PlusIcon />
              New task
            </Button>
          </>
        )}
      </PageHeader>

      {project.data.description && (
        <p className="max-w-3xl text-muted">{project.data.description}</p>
      )}

      {tasks.data.length === 0 ? (
        <EmptyState title="No tasks in this project yet.">
          {canManage && (
            <Button onClick={() => setDialog("new-task")}>Create the first task</Button>
          )}
        </EmptyState>
      ) : (
        <TaskBoard
          tasks={tasks.data}
          members={members.data}
          currentUserId={user.id}
          openTaskId={openTaskId}
          onOpen={setOpenTaskId}
        />
      )}

      {openTask && !dialog && (
        <TaskDrawer
          projectId={id}
          task={openTask}
          members={members.data}
          canManage={canManage}
          canUpdateStatus={
            canManage || (Boolean(membership) && openTask.assignedTo === user.id)
          }
          onChanged={tasks.reload}
          onClose={() => setOpenTaskId(null)}
          onEdit={() => setDialog("edit-task")}
          onDelete={() => setDialog("delete-task")}
        />
      )}

      {(dialog === "members" || dialog === "add-member") && (
        <ProjectMembersModal
          projectId={id}
          members={members.data}
          canManage={canManage}
          startAdding={dialog === "add-member"}
          onChanged={() => {
            members.reload();
            refresh();
          }}
          onClose={closeDialog}
        />
      )}
      {dialog === "edit-project" && (
        <ProjectFormModal
          project={project.data}
          onClose={closeDialog}
          onSaved={project.reload}
          onDelete={() => setDialog("delete-project")}
        />
      )}
      {dialog === "delete-project" && (
        <ConfirmDialog
          title="Delete project"
          message={`Delete "${project.data.name}" with all its tasks and comments? This cannot be undone.`}
          confirmLabel="Delete project"
          onConfirm={async () => {
            await deleteProject(id);
            router.replace("/projects");
          }}
          onClose={closeDialog}
        />
      )}
      {dialog === "new-task" && (
        <TaskFormModal
          projectId={id}
          members={members.data}
          onClose={closeDialog}
          onSaved={refresh}
        />
      )}
      {dialog === "edit-task" && openTask && (
        <TaskFormModal
          projectId={id}
          task={openTask}
          members={members.data}
          onClose={closeDialog}
          onSaved={tasks.reload}
        />
      )}
      {dialog === "delete-task" && openTask && (
        <ConfirmDialog
          title="Delete task"
          message={`Delete "${openTask.title}"? This cannot be undone.`}
          confirmLabel="Delete task"
          onConfirm={async () => {
            await deleteTask(id, openTask.id);
            setOpenTaskId(null);
            refresh();
          }}
          onClose={closeDialog}
        />
      )}
    </>
  );
}
