import { Logo } from "../ui/icons";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap bg-white">
      <section
        aria-label="About Nexora"
        className="flex min-w-0 flex-[1_1_420px] flex-col justify-between gap-12 overflow-hidden bg-ink px-5 py-4 text-white md:p-16"
      >
        <div className="flex items-center gap-3">
          <Logo size={34} />
          <span className="text-xl font-bold">Nexora</span>
        </div>
        <div aria-hidden="true" className="grid w-full max-w-[520px] grid-cols-3 gap-3 max-md:hidden">
          <div className="flex flex-col gap-2.5">
            <div className="h-3.5 w-1/2 rounded bg-[#3a404d]" />
            <div className="h-[72px] rounded-[10px] bg-ink-soft" />
            <div className="h-24 rounded-[10px] bg-ink-soft" />
          </div>
          <div className="flex flex-col gap-2.5 pt-7">
            <div className="h-3.5 w-3/5 rounded bg-[#3a404d]" />
            <div className="h-28 rounded-[10px] bg-accent" />
            <div className="h-16 rounded-[10px] bg-ink-soft" />
          </div>
          <div className="flex flex-col gap-2.5 pt-14">
            <div className="h-3.5 w-1/2 rounded bg-[#3a404d]" />
            <div className="h-20 rounded-[10px] bg-ink-soft" />
            <div className="h-20 rounded-[10px] bg-ink-soft" />
          </div>
        </div>
        <p className="max-w-[520px] text-[44px] leading-[1.12] font-bold tracking-tight max-md:hidden">
          Projects, tasks and your team in one workspace.
        </p>
      </section>
      <main className="flex min-w-0 flex-[1_1_420px] justify-center px-5 py-8 md:items-center md:p-16">
        <div className="flex w-full max-w-[400px] flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
