import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-6 pb-24 md:px-10 md:py-10">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-6 2xl:max-w-[1360px]">{children}</div>
      </main>
    </div>
  );
}
