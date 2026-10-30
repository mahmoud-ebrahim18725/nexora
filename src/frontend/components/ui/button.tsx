type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-indigo-600",
  secondary:
    "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-indigo-600",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-indigo-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
) {
  return `inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]}`;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`${buttonClasses(variant, size)} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          aria-hidden="true"
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="3"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
