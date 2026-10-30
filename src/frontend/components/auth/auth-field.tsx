// Input styled to match the login form.
export default function AuthField({
  id,
  label,
  error,
  ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12px] font-medium text-[#171b28]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-10 w-full rounded-[9px] border bg-white px-3 text-[13px] text-[#171b28] transition outline-none placeholder:text-[#667085] focus:border-[#5365e8] focus:ring-2 focus:ring-[#5365e8]/10 ${error ? "border-red-400" : "border-[#d5dbe5]"}`}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export const authSubmitClasses =
  "mt-[18px] flex h-[37px] w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#354de2] text-[12px] font-medium text-white transition hover:bg-[#2f45d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#354de2] disabled:cursor-not-allowed disabled:opacity-65";
