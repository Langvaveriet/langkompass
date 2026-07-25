"use client";

import { AppState } from "@/components/feedback/app-state";
import "./globals.css";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  return (
    <html lang="de">
      <body>
        <AppState
          eyebrow="LångKompass ist gerade nicht erreichbar"
          title="Die Anwendung konnte nicht vollständig gestartet werden."
          description="Versuche den Start erneut. Falls das Problem bestehen bleibt, kann die technische Kennung bei der Fehlersuche helfen."
          retry={reset}
          reference={error.digest}
        />
      </body>
    </html>
  );
}
