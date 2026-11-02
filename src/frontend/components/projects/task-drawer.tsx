"use client";

import {
  formatDate,
  isOverdue,
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "../../lib/format";
import { useSubmit } from "../../lib/use-submit";
import { updateTask } from "../../services/task-services";
import type { ProjectMember, Task, TaskStatus } from "../../types";
import { Button } from "../ui/button";
import { FormError } from "../ui/field";
import { Modal } from "../ui/modal";
import { TaskComments } from "./task-comments";

const STATUSES = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];

export function TaskDrawer({
  projectId,
  task,
  members,
  canManage,
  canUpdateStatus,
  onChanged,
  onClose,
  onEdit,
  onDelete,
}: {
  projectId: number;
  task: Task;
  members: ProjectMember[];
  canManage: boolean;
  canUpdateStatus: boolean;
  onChanged: () => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { pending, error, run } = useSubmit();
  const assignee = members.find((member) => member.id === task.assignedTo);
  const overdue = isOverdue(task.dueDate, task.status);

  async function changeStatus(status: TaskStatus) {
    if (status !== task.status && (await run(() => updateTask(projectId, task.id, { status })))) {
      onChanged();
    }
  }

  return (
    <Modal title={task.title} onClose={onClose} drawer>
      <FormError message={error?.message} />
      <div role="group" aria-label="Status" className="grid grid-cols-3 gap-1 rounded-[10px] bg-[#eef0f3] p-1">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            aria-pressed={status === task.status}
            disabled={!canUpdateStatus || pending}
            onClick={() => changeStatus(status)}
            className={`min-h-11 rounded-[7px] px-1 text-[13px] font-semibold disabled:cursor-not-allowed ${
              status === task.status ? "bg-ink text-white" : ""
            }`}
          >
            {TASK_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2.5 text-sm">
        <dt className="text-muted">Assignee</dt>
        <dd className="font-medium">{assignee?.name ?? "Unassigned"}</dd>
        <dt className="text-muted">Priority</dt>
        <dd className="font-medium">{PRIORITY_LABELS[task.priority]}</dd>
        <dt className="text-muted">Due date</dt>
        <dd className={`font-mono ${overdue ? "text-danger" : ""}`}>
          {task.dueDate ? formatDate(task.dueDate) : "None"}
          {overdue && " · Overdue"}
        </dd>
      </dl>

      {task.description && (
        <p className="whitespace-pre-line break-words text-[#3b4250]">{task.description}</p>
      )}

      {canManage && (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit}>
            Edit task
          </Button>
          <Button variant="ghost" className="text-danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      )}

      <TaskComments projectId={projectId} taskId={task.id} canManage={canManage} />
    </Modal>
  );
}
