import { initials } from "../../lib/format";

const COLORS = [
  "bg-ink text-white",
  "bg-accent text-white",
  "bg-[#0f5c52] text-white",
  "bg-[#6b3fa0] text-white",
  "bg-[#a5360c] text-white",
];

export function avatarColor(name: string) {
  const total = [...name].reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
  return COLORS[total % COLORS.length];
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const dimensions = size === "sm" ? "size-7 text-[11px]" : "size-9 text-[13px]";
  return (
    <span
      title={name}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${dimensions} ${className ?? avatarColor(name)}`}
    >
      {initials(name)}
    </span>
  );
}
