"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";
import { ApiError } from "@/frontend/lib/api-error";
import { logIn } from "@/frontend/services/auth-services";
import { loginSchema } from "@/frontend/validators/auth";

type FieldName = "email" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 7 7.5 5.5L19.5 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path strokeLinecap="round" d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 10h12m-5-5 5 5-5 5" />
    </svg>
  );
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submitting = useRef(false);
  const router = useRouter();

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    setError("");
    setFieldErrors({});

    let input: ReturnType<typeof loginSchema.parse>;
    try {
      input = loginSchema.parse({ email, password });
    } catch (caughtError) {
      if (caughtError instanceof ZodError) {
        const nextErrors: FieldErrors = {};
        for (const issue of caughtError.issues) {
          const field = issue.path[0];
          if (
            (field === "email" || field === "password") &&
            !nextErrors[field]
          ) {
            nextErrors[field] = issue.message;
          }
        }
        setFieldErrors(nextErrors);
      }
      return;
    }

    submitting.current = true;
    setIsLoading(true);
    try {
      await logIn(input);
      router.replace("/dashboard");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  }

  function updateField(field: FieldName, value: string) {
    if (field === "email") setEmail(value);
    else setPassword(value);
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError("");
  }

  return (
    <div className="w-full">
      <div className="mb-[27px]">
        <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.035em] text-[#171b28]">
          Welcome back
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-[#667085]">
          Sign in to your workspace to pick up where your team left off.
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

      <form onSubmit={handleSignIn} noValidate aria-busy={isLoading}>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[12px] font-medium text-[#171b28]"
          >
            Work email
          </label>
          <div
            className={`flex h-10 items-center gap-2.5 rounded-[9px] border bg-white px-2.5 text-[#667085] transition focus-within:border-[#5365e8] focus-within:ring-2 focus-within:ring-[#5365e8]/10 ${fieldErrors.email ? "border-red-400" : "border-[#d5dbe5]"}`}
          >
            <MailIcon />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#171b28] outline-none placeholder:text-[#667085]"
            />
          </div>
          {fieldErrors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="mt-[16px]">
          <label
            htmlFor="password"
            className="mb-1.5 block text-[12px] font-medium text-[#171b28]"
          >
            Password
          </label>
          <div
            className={`flex h-10 items-center gap-2.5 rounded-[9px] border bg-white px-2.5 text-[#667085] transition focus-within:border-[#5365e8] focus-within:ring-2 focus-within:ring-[#5365e8]/10 ${fieldErrors.password ? "border-red-400" : "border-[#d5dbe5]"}`}
          >
            <LockIcon />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-[#171b28] outline-none placeholder:text-[#667085]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="rounded p-0.5 text-[#667085] hover:text-[#344054] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5365e8]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z"
                />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </button>
          </div>
          {fieldErrors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-red-600">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-[18px] flex h-[37px] w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#354de2] text-[12px] font-medium text-white transition hover:bg-[#2f45d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#354de2] disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isLoading ? "Signing in..." : "Sign in"}
          {!isLoading && <ArrowIcon />}
        </button>
      </form>

      <Link
        href="/register"
        className="mt-[29px] flex min-h-[64px] items-center justify-between gap-3 rounded-[11px] border border-[#d9dee7] bg-white px-[14px] py-2.5 transition hover:border-[#c6cee0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5365e8]"
      >
        <span>
          <span className="block text-[12px] font-medium text-[#171b28]">
            Create a company account
          </span>
          <span className="mt-0.5 block text-[10px] text-[#667085]">
            Set up a workspace for your team in minutes.
          </span>
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf1ff] text-[#354de2]">
          <ArrowIcon />
        </span>
      </Link>
    </div>
  );
}
