"use client";

import { useState } from "react";
import Avatar from "@/frontend/components/ui/avatar";
import Badge from "@/frontend/components/ui/badge";
import Button from "@/frontend/components/ui/button";
import ConfirmDialog from "@/frontend/components/ui/confirm-dialog";
import { FormError, inputClasses } from "@/frontend/components/ui/field";
import { ErrorState, PageSkeleton } from "@/frontend/components/ui/states";
import InviteMemberModal from "./invite-member-modal";
import { useCurrentUser } from "@/frontend/context/current-user";
import { getErrorMessage, useResource } from "@/frontend/lib/use-resource";
import {
  changeTeamMemberRole,
  listTeamMembers,
  removeTeamMember,
} from "@/frontend/services/team-services";
import type { Role, TeamMember } from "@/frontend/types/team";

const roleOrder: Record<Role, number> = { owner: 0, admin: 1, member: 2 };

export default function TeamView() {
  const user = useCurrentUser();
  const isOwner = user.role === "owner";
  const { data: members, error, reload } = useResource(listTeamMembers, "team");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [roleError, setRoleError] = useState("");
  const [pendingRoleId, setPendingRoleId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!members) return <PageSkeleton label="Loading team" />;

  async function handleRoleChange(
    member: TeamMember,
    role: "admin" | "member",
  ) {
    setRoleError("");
    setPendingRoleId(member.id);
    try {
      await changeTeamMemberRole(member.id, role);
      reload();
    } catch (caughtError) {
      setRoleError(getErrorMessage(caughtError));
    } finally {
      setPendingRoleId(null);
    }
  }

  const search = query.trim().toLowerCase();
  const visibleMembers = [...members]
    .sort(
      (a, b) =>
        roleOrder[a.role] - roleOrder[b.role] || a.name.localeCompare(b.name),
    )
    .filter(
      (member) =>
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search),
    );
  const counts = {
    admin: members.filter((member) => member.role === "admin").length,
    member: members.filter((member) => member.role === "member").length,
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Team
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            {members.length} {members.length === 1 ? "person" : "people"} ·{" "}
            {counts.admin} {counts.admin === 1 ? "admin" : "admins"} ·{" "}
            {counts.member} {counts.member === 1 ? "member" : "members"}
          </p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19v-1.5A3.5 3.5 0 0 0 11.5 14h-4A3.5 3.5 0 0 0 4 17.5V19M9.5 10.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 8v6M22 11h-6"
            />
          </svg>
          Invite member
        </Button>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3 sm:px-6">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search team"
            className={`${inputClasses} h-9 sm:max-w-xs`}
          />
        </div>
        {roleError && (
          <div className="px-5 pt-4 sm:px-6">
            <FormError message={roleError} />
          </div>
        )}
        {visibleMembers.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            No one matches your search.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visibleMembers.map((member) => {
              const isSelf = member.id === user.id;
              const canEditRole = isOwner && member.role !== "owner";
              const canRemove =
                !isSelf &&
                member.role !== "owner" &&
                (isOwner || member.role === "member");
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
                        {isSelf && (
                          <span className="text-gray-400"> (you)</span>
                        )}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
                    {canEditRole ? (
                      <select
                        value={member.role}
                        disabled={pendingRoleId === member.id}
                        onChange={(event) =>
                          handleRoleChange(
                            member,
                            event.target.value as "admin" | "member",
                          )
                        }
                        aria-label={`Role for ${member.name}`}
                        className={`${inputClasses} h-8 w-28 text-xs`}
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                    ) : (
                      <Badge value={member.role} />
                    )}
                    {canRemove && (
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
        )}
      </section>

      {isInviteOpen && (
        <InviteMemberModal
          canInviteAdmins={isOwner}
          onClose={() => setIsInviteOpen(false)}
        />
      )}
      <ConfirmDialog
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        title="Remove from workspace"
        description={`${memberToRemove?.name ?? "This person"} will lose access to the workspace and all of its projects. This can't be undone.`}
        confirmLabel="Remove"
        onConfirm={async () => {
          if (!memberToRemove) return;
          await removeTeamMember(memberToRemove.id);
          reload();
        }}
      />
    </div>
  );
}
