"use client";

import { AppState } from "@/components/feedback/app-state";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <AppState
      eyebrow="Etwas ist ins Stocken geraten"
      title="Diese Seite konnte gerade nicht geladen werden."
      description="Deine Eingaben werden nicht bewertet oder ergänzt. Versuche es noch einmal oder kehre zum Dashboard zurück."
      retry={reset}
      reference={error.digest}
    />
  );
}
