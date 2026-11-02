import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "dark" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  dark: "bg-ink text-white hover:bg-ink-soft",
  secondary: "border border-line-strong bg-white hover:bg-ground",
  ghost: "hover:bg-column",
  danger: "bg-danger text-white hover:opacity-90",
};

export function buttonClass(variant: Variant = "primary") {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

export function Button({
  variant,
  loading = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${buttonClass(variant)} ${className}`}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
