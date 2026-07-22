export function TopBar() {
  return (
    <header className="h-[72px] w-full border-b border-border-subtle bg-surface-raised">
      <div className="flex h-full w-full items-center justify-between px-8 lg:px-14 2xl:px-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-forest-strong">
            LångKompass
          </p>

          <p className="mt-0.5 text-sm text-text-muted">
            Dein ruhiger Gesundheitskompass
          </p>
        </div>

        <p className="text-sm text-text-muted">
          Sprint 1
        </p>
      </div>
    </header>
  );
}
