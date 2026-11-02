"use client";

import { useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

export function PasswordField({
  label,
  error,
  ...props
}: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 text-sm font-medium">
      <label htmlFor={props.name}>{label}</label>
      <span className="relative">
        <input
          id={props.name}
          type={visible ? "text" : "password"}
          className="min-h-11 w-full rounded-lg border border-line-strong bg-white pr-12 pl-3 text-base font-normal"
          {...props}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
      {error && <span className="font-normal text-danger">{error}</span>}
    </div>
  );
}
