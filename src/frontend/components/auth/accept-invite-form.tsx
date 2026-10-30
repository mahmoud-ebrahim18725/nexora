"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthField, { authSubmitClasses } from "./auth-field";
import { getErrorMessage } from "@/frontend/lib/use-resource";
import { acceptInvitation } from "@/frontend/services/team-services";

type FieldErrors = Partial<Record<"name" | "password" | "confirm", string>>;

export default function AcceptInviteForm({
  id,
  token,
}: {
  id: number | null;
  token: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!id || !token) {
    return (
      <div className="w-full">
        <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.035em] text-[#171b28]">
          Invalid invitation link
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-[#667085]">
          This link is missing information. Ask the person who invited you to
          send a new one.
        </p>
        <Link href="/" className={`${authSubmitClasses} mt-6`}>
          Go to sign in
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !id || !token) return;
    setError("");
    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters long";
    }
    if (confirm !== password) nextErrors.confirm = "Passwords don't match";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    try {
      await acceptInvitation({ id, token, name: name.trim(), password });
      router.replace("/dashboard");
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-[27px]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf1ff] px-2.5 py-1 text-[11px] font-medium text-[#354de2]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#354de2]" />
          You&apos;ve been invited
        </span>
        <h1 className="mt-3 text-[28px] leading-[1.2] font-semibold tracking-[-0.035em] text-[#171b28]">
          Join your team
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-[#667085]">
          Create your account to start collaborating on Nexora.
        </p>
      </div>

      {error && (
        <p
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isLoading}
        className="space-y-4"
      >
        <AuthField
          id="name"
          label="Your name"
          autoComplete="name"
          placeholder="Jane Cooper"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setFieldErrors((current) => ({ ...current, name: undefined }));
          }}
          error={fieldErrors.name}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setFieldErrors((current) => ({ ...current, password: undefined }));
          }}
          error={fieldErrors.password}
        />
        <AuthField
          id="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirm}
          onChange={(event) => {
            setConfirm(event.target.value);
            setFieldErrors((current) => ({ ...current, confirm: undefined }));
          }}
          error={fieldErrors.confirm}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={authSubmitClasses}
        >
          {isLoading ? "Joining..." : "Accept invitation"}
        </button>
      </form>
    </div>
  );
}
