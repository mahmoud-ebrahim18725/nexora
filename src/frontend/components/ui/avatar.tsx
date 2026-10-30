import { getInitials } from "@/frontend/lib/format";

const palette = [
  "bg-indigo-100 text-indigo-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
];

export default function Avatar({
  name,
  id = 0,
  size = "md",
}: {
  name: string;
  id?: number;
  size?: "sm" | "md";
}) {
  return (
    <span
      title={name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white ${palette[id % palette.length]} ${size === "sm" ? "h-6 w-6 text-[10px]" : "h-9 w-9 text-xs"}`}
    >
      {getInitials(name)}
    </span>
  );
}
