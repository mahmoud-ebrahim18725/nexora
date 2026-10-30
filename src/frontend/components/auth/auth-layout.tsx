import Link from "next/link";

export default function AuthLayout({
  children,
  headline,
  tagline,
}: {
  children: React.ReactNode;
  headline: React.ReactNode;
  tagline: string;
}) {
  return (
    <main className="min-h-screen bg-[#fbfcfe] text-[#111827] lg:grid lg:min-h-screen lg:grid-cols-[47.6%_52.4%]">
      <section className="relative flex min-h-screen flex-col px-[22px] py-8 sm:px-10 lg:px-[7.5vw] lg:py-7">
        <header className="absolute top-[34px] left-[22px] sm:left-10 lg:top-7 lg:left-[58px]">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5365e8]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#111827] text-sm font-medium text-white">
              N
            </span>
            <span className="text-base font-semibold tracking-tight">
              Nexora
            </span>
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-[344px] flex-1 items-center py-28 sm:py-32 lg:py-24">
          {children}
        </div>

        <footer className="absolute bottom-[30px] left-[22px] text-[11px] text-[#667085] sm:left-10 lg:bottom-[29px] lg:left-[58px]">
          © 2026 Nexora Inc. All rights reserved.
        </footer>
      </section>

      <aside
        aria-label="About Nexora"
        className="relative hidden min-h-screen overflow-hidden bg-[#101526] lg:flex lg:items-center lg:px-[7.5vw]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(48,76,203,0.36),transparent_48%)]"
        />
        <div className="relative z-10 max-w-[440px]">
          <h2 className="text-[40px] leading-[1.35] font-semibold tracking-[-0.035em] text-white xl:text-[42px]">
            {headline}
          </h2>
          <p className="mt-4 max-w-[410px] text-sm leading-[1.65] text-[#a7b0c3]">
            {tagline}
          </p>
        </div>
      </aside>
    </main>
  );
}
