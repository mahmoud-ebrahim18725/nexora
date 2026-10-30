"use client";

import { useState } from "react";
import Modal from "@/frontend/components/ui/modal";
import Button from "@/frontend/components/ui/button";
import Field, { FormError, inputClasses } from "@/frontend/components/ui/field";
import { getErrorMessage } from "@/frontend/lib/use-resource";
import { createInvitation } from "@/frontend/services/team-services";

type InvitableRole = "admin" | "member";

export default function InviteMemberModal({
  canInviteAdmins,
  onClose,
}: {
  canInviteAdmins: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitableRole>("member");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const invitation = await createInvitation({ email: email.trim(), role });
      const params = new URLSearchParams({
        id: String(invitation.id),
        token: invitation.token,
      });
      setInviteLink(`${window.location.origin}/invite?${params.toString()}`);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setIsCopied(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={() => !isLoading && onClose()}
      title={inviteLink ? "Invitation ready" : "Invite a teammate"}
      description={
        inviteLink
          ? `Share this link with ${email.trim()}. It expires in 7 days.`
          : "They'll get a link to create their account."
      }
    >
      {inviteLink ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              readOnly
              value={inviteLink}
              aria-label="Invitation link"
              onFocus={(event) => event.currentTarget.select()}
              className={`${inputClasses} h-10 font-mono text-xs`}
            />
            <Button variant="secondary" onClick={handleCopy}>
              {isCopied ? "Copied" : "Copy"}
            </Button>
          </div>
          <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800">
            This link is shown only once. Nexora doesn&apos;t send emails yet,
            so copy it now and share it yourself.
          </p>
          <div className="flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormError message={error} />
          <Field id="invite-email" label="Email" error={emailError}>
            <input
              id="invite-email"
              type="email"
              autoFocus
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError("");
              }}
              placeholder="teammate@company.com"
              aria-invalid={Boolean(emailError)}
              className={`${inputClasses} h-10`}
            />
          </Field>
          <fieldset>
            <legend className="mb-1.5 block text-xs font-medium text-gray-700">
              Workspace role
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  {
                    value: "member",
                    title: "Member",
                    text: "Works on projects they're added to.",
                  },
                  {
                    value: "admin",
                    title: "Admin",
                    text: "Creates projects and manages the team.",
                  },
                ] as const
              ).map((option) => {
                const disabled = option.value === "admin" && !canInviteAdmins;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer flex-col rounded-lg border p-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500/30 ${role === option.value ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-50"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      type="radio"
                      name="invite-role"
                      value={option.value}
                      checked={role === option.value}
                      disabled={disabled}
                      onChange={() => setRole(option.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {option.title}
                    </span>
                    <span className="mt-0.5 text-xs text-gray-500">
                      {disabled
                        ? "Only the owner can invite admins."
                        : option.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create invitation
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
