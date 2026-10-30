"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/frontend/services/auth-services";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/projects/")) return "Project";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/team")) return "Team";
  return "Dashboard";
}

export default function Header({
  user,
  isMobileNavOpen,
  onMenuToggle,
}: {
  user: { name: string; email: string };
  isMobileNavOpen: boolean;
  onMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    function handleDocumentMouseDown(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, []);

  async function handleLogout() {
    if (isLoggingOut) return;

    setLogoutError("");
    setIsLoggingOut(true);

    try {
      await logout();
      router.replace("/");
    } catch {
      setLogoutError("Unable to log out. Please try again.");
      setIsLoggingOut(false);
    }
  }
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMobileNavOpen}
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 lg:hidden"
        >
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
              d="M4 6.5h16M4 12h16M4 17.5h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {getPageTitle(pathname)}
        </h1>
      </div>
      <div className="relative" ref={userMenuRef}>
        <button
          type="button"
          aria-label="Open user menu"
          aria-expanded={isUserMenuOpen}
          aria-haspopup="menu"
          aria-controls="user-menu"
          onClick={() => {
            setLogoutError("");
            setIsUserMenuOpen((open) => !open);
          }}
          className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">Account</p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
            aria-hidden="true"
          >
            {getInitials(user.name)}
          </div>
          <svg
            aria-hidden="true"
            className={`hidden h-4 w-4 text-gray-400 transition sm:block ${isUserMenuOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6 9 6 6 6-6"
            />
          </svg>
        </button>
        {isUserMenuOpen && (
          <div
            id="user-menu"
            role="menu"
            aria-label="User menu"
            className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg shadow-gray-900/5"
          >
            <div className="border-b border-gray-100 px-3 py-2">
              <p className="truncate text-sm font-medium text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-500">{user.email}</p>
            </div>
            {logoutError && (
              <p
                className="px-3 py-2 text-xs leading-5 text-red-600"
                role="alert"
              >
                {logoutError}
              </p>
            )}
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="mt-1 flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
