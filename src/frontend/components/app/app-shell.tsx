"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import {
  CurrentUserProvider,
  type SessionUser,
} from "@/frontend/context/current-user";

export default function AppShell({
  children,
  user,
  companyName,
}: {
  children: React.ReactNode;
  user: SessionUser;
  companyName?: string;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <CurrentUserProvider user={user}>
      <div className="min-h-screen bg-[#f8f9fc] text-gray-900">
        <Sidebar
          user={user}
          companyName={companyName}
          isMobileOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
        <div className="lg:pl-64">
          <Header
            user={user}
            isMobileNavOpen={isMobileNavOpen}
            onMenuToggle={() => setIsMobileNavOpen((open) => !open)}
          />
          <main className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </CurrentUserProvider>
  );
}
