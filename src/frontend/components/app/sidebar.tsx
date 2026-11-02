"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../../context/current-user";
import { ROLE_LABELS } from "../../lib/format";
import { logout } from "../../services/auth-services";
import { Avatar } from "../ui/avatar";
import {
  CloseIcon,
  DashboardIcon,
  FolderIcon,
  LogoutIcon,
  Logo,
  MenuIcon,
  TeamIcon,
} from "../ui/icons";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/projects", label: "Projects", icon: FolderIcon },
  { href: "/team", label: "Team", icon: TeamIcon },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const links = LINKS.filter(
    (link) => link.href !== "/team" || user.role !== "member",
  );

  return (
    <div className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 ${
              active
                ? "bg-accent font-semibold text-white"
                : "hover:bg-ink-soft hover:text-white"
            }`}
          >
            <Icon />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

function UserCard() {
  const router = useRouter();
  const user = useCurrentUser();

  async function signOut() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="mt-auto flex items-center gap-3 border-t border-ink-line px-2 pt-3">
      <Avatar name={user.name} className="bg-ink-line text-white" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-white">
          {user.name}
        </span>
        <span className="block truncate text-[13px]">{ROLE_LABELS[user.role]}</span>
      </span>
      <button
        type="button"
        aria-label="Log out"
        onClick={signOut}
        className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-ink-soft hover:text-white"
      >
        <LogoutIcon />
      </button>
    </div>
  );
}

function Brand() {
  const user = useCurrentUser();

  return (
    <span className="flex min-w-0 items-center gap-3">
      <span className="shrink-0">
        <Logo />
      </span>
      <span className="truncate text-lg font-bold text-white">
        {user.companyName}
      </span>
    </span>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ref.current && !ref.current.open) {
      ref.current.showModal();
    }
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label="Menu"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) {
          onClose();
        }
      }}
      className="slide-in-left m-0 h-dvh max-h-none w-72 max-w-[85vw] bg-ink text-on-ink"
    >
      <nav
        aria-label="Mobile"
        className="flex h-full flex-col gap-6 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-between pl-2">
          <Brand />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-ink-soft hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
        <UserCard />
      </nav>
    </dialog>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center gap-1 bg-ink px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-white hover:bg-ink-soft"
        >
          <MenuIcon />
        </button>
        <Brand />
      </header>

      <nav
        aria-label="Main"
        className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-8 bg-ink p-4 py-6 text-on-ink md:flex"
      >
        <span className="px-2">
          <Brand />
        </span>
        <NavLinks />
        <UserCard />
      </nav>

      {open && <MobileMenu onClose={() => setOpen(false)} />}
    </>
  );
}
