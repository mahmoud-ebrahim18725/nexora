import Link from "next/link";

const TABS = [
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Register" },
];

export function AuthTabs({ active }: { active: string }) {
  return (
    <nav aria-label="Sign in or register" className="grid grid-cols-2 gap-1 rounded-[10px] bg-[#eef0f3] p-1">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.href === active ? "page" : undefined}
          className={`flex min-h-11 items-center justify-center rounded-[7px] font-semibold ${
            tab.href === active ? "bg-white" : "text-muted"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
