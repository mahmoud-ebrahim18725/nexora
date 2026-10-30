"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarUser = {
  name: string;
  email: string;
  role: string;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: "grid", adminOnly: false },
  { label: "Projects", href: "/projects", icon: "folder", adminOnly: false },
  { label: "Team", href: "/team", icon: "users", adminOnly: true },
];

function NavigationIcon({ type }: { type: string }) {
  if (type === "folder") {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 7.5h5l1.5 1.75h10v8.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V7.5Z"
        />
      </svg>
    );
  }
  if (type === "users") {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 19v-1.25A3.75 3.75 0 0 0 12.25 14h-2.5A3.75 3.75 0 0 0 6 17.75V19m5-9.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5.25 1.25a2.75 2.75 0 1 0 0-5.5M18 14.25a3.5 3.5 0 0 1 3 3.5V19"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01"
      />
    </svg>
  );
}

export default function Sidebar({
  user,
  companyName,
  isMobileOpen,
  onClose,
}: {
  user: SidebarUser;
  companyName?: string;
  isMobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-gray-900/20 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white px-4 py-5 transition-transform duration-200 lg:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 px-2 pb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
            {companyName?.trim().charAt(0).toUpperCase() || "C"}
          </div>
          <p className="truncate text-sm font-semibold text-gray-900">
            {companyName || "Your company"}
          </p>
        </div>
        <nav className="mt-6 flex-1" aria-label="Primary navigation">
          <ul className="space-y-1">
            {navigation
              .filter((item) => !item.adminOnly || user.role !== "member")
              .map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    >
                      <NavigationIcon type={item.icon} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
        <div className="border-t border-gray-100 px-2 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
