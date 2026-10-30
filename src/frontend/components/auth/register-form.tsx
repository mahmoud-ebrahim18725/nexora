"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import AuthField, { authSubmitClasses } from "./auth-field";
import { ApiError } from "@/frontend/lib/api-error";
import { register } from "@/frontend/services/auth-services";
import type { RegisterInput } from "@/frontend/types/auth";

const registerSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, { message: "Company name is required" }),
  name: z.string().trim().min(1, { message: "Name is required" }),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterInput>({
    companyName: "",
    name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: keyof RegisterInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    setError("");

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof RegisterInput;
        nextErrors[field] ??= issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register(parsed.data);
      router.replace("/dashboard");
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message);
        if (caughtError.details) setFieldErrors(caughtError.details);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-[27px]">
        <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.035em] text-[#171b28]">
          Create your workspace
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-[#667085]">
          Set up your company and invite your team in minutes.
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
          id="companyName"
          label="Company name"
          autoComplete="organization"
          placeholder="Acme Inc."
          value={values.companyName}
          onChange={(event) => updateField("companyName", event.target.value)}
          error={fieldErrors.companyName}
        />
        <AuthField
          id="name"
          label="Your name"
          autoComplete="name"
          placeholder="Jane Cooper"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          error={fieldErrors.name}
        />
        <AuthField
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          error={fieldErrors.email}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          error={fieldErrors.password}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={authSubmitClasses}
        >
          {isLoading ? "Creating workspace..." : "Create workspace"}
        </button>
      </form>

      <p className="mt-6 text-center text-[12px] text-[#667085]">
        Already have an account?{" "}
        <Link
          href="/"
          className="font-medium text-[#354de2] hover:text-[#2f45d2]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
