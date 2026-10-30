"use client";

import { createContext, useContext } from "react";
import type { Role } from "@/frontend/types/team";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

const CurrentUserContext = createContext<SessionUser | null>(null);

export function CurrentUserProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const user = useContext(CurrentUserContext);
  if (!user) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider");
  }
  return user;
}
