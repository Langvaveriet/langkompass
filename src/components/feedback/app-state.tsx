"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

type AppStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  retry?: () => void;
  reference?: string;
};

export function AppState({
  eyebrow,
  title,
  description,
  retry,
  reference,
}: AppStateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-10">
      <section className="w-full max-w-xl rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-7 shadow-md sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-copper">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-text-secondary">
          {description}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {retry ? (
            <Button onClick={retry} size="lg">
              Erneut versuchen
            </Button>
          ) : null}
          <Link
            href="/"
            className="inline-flex min-h-14 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-6 py-4 text-base font-semibold text-text-primary transition hover:bg-surface-muted"
          >
            Zum Dashboard
          </Link>
        </div>

        {reference ? (
          <p className="mt-6 text-xs leading-5 text-text-muted">
            Technische Kennung: {reference}
          </p>
        ) : null}
      </section>
    </main>
  );
}
