export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm text-muted">{eyebrow}</p>
        <h1 className="text-[28px] leading-tight md:text-[32px] font-bold tracking-tight">
          {title}
        </h1>
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  );
}
