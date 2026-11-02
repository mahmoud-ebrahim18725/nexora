import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const CONTROL =
  "w-full rounded-lg border border-line-strong bg-white px-3 text-base font-normal disabled:bg-ground";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
      {error && <span className="font-normal text-danger">{error}</span>}
    </label>
  );
}

type FieldProps = { label: string; error?: string };

export function TextField({
  label,
  error,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field label={label} error={error}>
      <input className={`${CONTROL} min-h-11`} {...props} />
    </Field>
  );
}

export function SelectField({
  label,
  error,
  children,
  ...props
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field label={label} error={error}>
      <select className={`${CONTROL} min-h-11`} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function TextAreaField({
  label,
  error,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field label={label} error={error}>
      <textarea className={`${CONTROL} resize-y py-2.5`} {...props} />
    </Field>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }
  return (
    <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2.5 text-sm text-danger">
      {message}
    </p>
  );
}
