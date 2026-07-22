import Link from "next/link";

import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { Section } from "@/components/layout/section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";

const overviewCards = [
  {
    title: "Gesundheitsprofil",
    value: "Noch nicht eingerichtet",
    description:
      "Persönliche Basisdaten, Gesundheitsziele und relevante Rahmenbedingungen.",
    href: "/gesundheitsprofil",
  },
  {
    title: "Laborwerte",
    value: "0 Messungen",
    description:
      "Blutwerte und andere Laborergebnisse strukturiert erfassen und vergleichen.",
    href: "/laborwerte",
  },
  {
    title: "Compass AI",
    value: "Bereit für Kontext",
    description:
      "Ruhige, verständliche Einordnung auf Basis deiner freigegebenen Gesundheitsdaten.",
    href: "/compass-ai",
  },
  {
    title: "Tageserfassung",
    value: "Heute noch offen",
    description:
      "Wohlbefinden, Symptome, Schlaf und persönliche Beobachtungen dokumentieren.",
    href: "/tageserfassung",
  },
];

export default function HomePage() {
  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Dein Gesundheitskompass</PageTitle>

          <PageSubtitle className="mt-4">
            Gesundheitsdaten verstehen, Entwicklungen erkennen und die nächsten
            Schritte klar einordnen.
          </PageSubtitle>
        </header>

        <Section
          aria-label="Gesundheitsübersicht"
          className="grid grid-cols-12 gap-5"
        >
          {overviewCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group col-span-12 rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-4 sm:col-span-6 xl:col-span-3"
            >
              <Card className="h-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-3">
                  <p className="text-base font-semibold text-text-primary">
                    {card.value}
                  </p>

                  <p className="text-sm leading-6 text-text-muted">
                    {card.description}
                  </p>

                  <span className="mt-2 text-sm font-semibold text-forest-strong">
                    Bereich öffnen →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Section>

        <Section
          aria-label="Weitere Übersicht"
          className="grid grid-cols-12 gap-5"
        >
          <Card className="col-span-12 xl:col-span-8">
            <CardHeader>
              <CardTitle>Gesundheitsverlauf</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex min-h-64 items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border-strong bg-surface-muted">
                <p className="text-sm text-text-muted">
                  Diagramme und zeitliche Entwicklungen erscheinen hier.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-4">
            <CardHeader>
              <CardTitle>Nächste Schritte</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="grid gap-4 text-sm text-text-muted">
                <li>Gesundheitsprofil vervollständigen</li>
                <li>Erste Tageserfassung anlegen</li>
                <li>Laborbericht hinzufügen</li>
              </ul>
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
