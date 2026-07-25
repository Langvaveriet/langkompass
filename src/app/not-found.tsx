import { AppState } from "@/components/feedback/app-state";

export default function NotFoundPage() {
  return (
    <AppState
      eyebrow="Seite nicht gefunden"
      title="Hier führt gerade kein Weg weiter."
      description="Die aufgerufene Adresse gibt es nicht oder sie wurde verschoben. Vom Dashboard aus findest du alle verfügbaren Bereiche."
    />
  );
}
