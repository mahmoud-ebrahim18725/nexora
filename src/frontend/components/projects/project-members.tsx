"use client";

import { useState } from "react";
import Avatar from "@/frontend/components/ui/avatar";
import Badge from "@/frontend/components/ui/badge";
import Button from "@/frontend/components/ui/button";
import ConfirmDialog from "@/frontend/components/ui/confirm-dialog";
import Field, { FormError, inputClasses } from "@/frontend/components/ui/field";
import Modal from "@/frontend/components/ui/modal";
import { ErrorState } from "@/frontend/components/ui/states";
import { formatLabel } from "@/frontend/lib/format";
import { getErrorMessage, useResource } from "@/frontend/lib/use-resource";
import {
  addProjectMember,
  changeProjectMemberRole,
  removeProjectMember,
} from "@/frontend/services/project-services";
import { listTeamMembers } from "@/frontend/services/team-services";
import type { ProjectMember, ProjectRole } from "@/frontend/types/project";

function AddMemberModal({
  projectId,
  existingIds,
  canChooseRole,
  onClose,
  onAdded,
}: {
  projectId: number;
  existingIds: Set<number>;
  canChooseRole: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const {
    data: team,
    error: loadError,
    reload,
  } = useResource(listTeamMembers, "team");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<ProjectRole>("member");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const candidates = (team ?? []).filter(
    (member) => !existingIds.has(member.id),
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) {
      setError("Choose someone to add");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await addProjectMember(projectId, {
        userId: Number(userId),
        role: canChooseRole ? role : undefined,
      });
      onAdded();
      onClose();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={() => !isLoading && onClose()}
      title="Add member"
      description="Give a teammate access to this project."
    >
      {loadError ? (
        <ErrorState error={loadError} onRetry={reload} />
      ) : !team ? (
        <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
      ) : candidates.length === 0 ? (
        <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
          Everyone on your team is already in this project.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormError message={error} />
          <Field id="member-user" label="Teammate">
            <select
              id="member-user"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className={`${inputClasses} h-10`}
            >
              <option value="">Select a person…</option>
              {candidates.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} · {member.email}
                </option>
              ))}
            </select>
          </Field>
          {canChooseRole && (
            <Field id="member-role" label="Project role">
              <select
                id="member-role"
                value={role}
                onChange={(event) => setRole(event.target.value as ProjectRole)}
                className={`${inputClasses} h-10`}
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
              </select>
            </Field>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Add member
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default function ProjectMembers({
  projectId,
  members,
  currentUserId,
  currentUserRole,
  isManager,
  onChanged,
}: {
  projectId: number;
  members: ProjectMember[];
  currentUserId: number;
  currentUserRole: string;
  isManager: boolean;
  onChanged: () => void;
}) {
  const isOwner = currentUserRole === "owner";
  // Adding needs the company member list, which only owners and admins can read.
  const canAdd = isOwner || (isManager && currentUserRole === "admin");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<ProjectMember | null>(
    null,
  );
  const [roleError, setRoleError] = useState("");
  const [pendingRoleId, setPendingRoleId] = useState<number | null>(null);

  async function handleRoleChange(member: ProjectMember, role: ProjectRole) {
    setRoleError("");
    setPendingRoleId(member.id);
    try {
      await changeProjectMemberRole(projectId, { userId: member.id, role });
      onChanged();
    } catch (caughtError) {
      setRoleError(getErrorMessage(caughtError));
    } finally {
      setPendingRoleId(null);
    }
  }

  const managers = members.filter((member) => member.projectRole === "manager");
  const sortedMembers = [
    ...managers,
    ...members.filter((member) => member.projectRole !== "manager"),
  ];

  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Members</h3>
          <p className="mt-0.5 text-sm text-gray-500">
            {members.length} {members.length === 1 ? "person" : "people"} ·{" "}
            {managers.length} {managers.length === 1 ? "manager" : "managers"}
          </p>
        </div>
        {canAdd && (
          <Button size="sm" onClick={() => setIsAddOpen(true)}>
            Add member
          </Button>
        )}
      </div>
      {isManager && !canAdd && (
        <p className="border-b border-gray-100 bg-amber-50 px-5 py-2.5 text-xs text-amber-800 sm:px-6">
          Ask the workspace owner or an admin to add new people to this project.
        </p>
      )}
      {roleError && (
        <div className="px-5 pt-4 sm:px-6">
          <FormError message={roleError} />
        </div>
      )}
      <ul className="divide-y divide-gray-100">
        {sortedMembers.map((member) => {
          const isSelf = member.id === currentUserId;
          const canRemove =
            isOwner || (isManager && member.projectRole !== "manager");
          return (
            <li
              key={member.id}
              className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={member.name} id={member.id} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {member.name}
                    {isSelf && <span className="text-gray-400"> (you)</span>}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
                {isOwner ? (
                  <select
                    value={member.projectRole}
                    disabled={pendingRoleId === member.id}
                    onChange={(event) =>
                      handleRoleChange(
                        member,
                        event.target.value as ProjectRole,
                      )
                    }
                    aria-label={`Project role for ${member.name}`}
                    className={`${inputClasses} h-8 w-32 text-xs`}
                  >
                    <option value="manager">Manager</option>
                    <option value="member">Member</option>
                  </select>
                ) : (
                  <Badge
                    value={member.projectRole}
                    label={formatLabel(member.projectRole)}
                  />
                )}
                {canRemove && !isSelf && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMemberToRemove(member)}
                    className="hover:text-red-600"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {isAddOpen && (
        <AddMemberModal
          projectId={projectId}
          existingIds={new Set(members.map((member) => member.id))}
          canChooseRole={isOwner}
          onClose={() => setIsAddOpen(false)}
          onAdded={onChanged}
        />
      )}
      <ConfirmDialog
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        title="Remove member"
        description={`${memberToRemove?.name ?? "This person"} will lose access to this project. Tasks assigned to them stay assigned.`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (!memberToRemove) return;
          await removeProjectMember(projectId, memberToRemove.id);
          onChanged();
        }}
      />
    </section>
  );
}
