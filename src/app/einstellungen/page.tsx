import Link from "next/link";

import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { Section } from "@/components/layout/section";
import { UserSettingsForm } from "@/components/settings/user-settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { defaultTimeZone } from "@/lib/user-settings";

type PageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function EinstellungenPage({ searchParams }: PageProps) {
  const [user, query] = await Promise.all([requireUser(), searchParams]);
  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Einstellungen</PageTitle>
          <PageSubtitle className="mt-4">
            Persönliche Zeit- und Kontoeinstellungen für deine Erfassung.
          </PageSubtitle>
        </header>

        {query.saved === "1" ? (
          <div
            role="status"
            className="rounded-[var(--radius-md)] border border-forest-strong bg-forest-soft px-5 py-4 text-sm font-medium text-forest-strong"
          >
            Einstellungen wurden gespeichert.
          </div>
        ) : null}

        {query.error ? (
          <div
            role="alert"
            className="rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-800"
          >
            Bitte wähle eine unterstützte Zeitzone.
          </div>
        ) : null}

        <Section className="grid grid-cols-12 gap-5" aria-label="Einstellungen">
          <Card className="col-span-12 xl:col-span-8">
            <CardHeader>
              <CardTitle>Darstellung von Datum und Uhrzeit</CardTitle>
            </CardHeader>
            <CardContent>
              <UserSettingsForm
                timeZone={settings?.timeZone ?? defaultTimeZone}
              />
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-4">
            <CardHeader>
              <CardTitle>Kontosicherheit</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm leading-6 text-text-muted">
                Passkeys und berechtigte Geräte werden getrennt von deinen
                Gesundheitsangaben verwaltet.
              </p>
              <Link
                href="/konto/sicherheit"
                className="text-sm font-semibold text-forest-strong"
              >
                Passkeys verwalten →
              </Link>
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-8">
            <CardHeader>
              <CardTitle>Deine Daten herunterladen</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div>
                <p className="text-sm leading-6 text-text-muted">
                  Der vollständige JSON-Export enthält deine Profil-, Tages-,
                  Ernährungs-, Trainings-, Labor- und Supplementdaten. Für
                  Tabellenprogramme stehen die wichtigsten Bereiche zusätzlich
                  als CSV bereit.
                </p>
                <p className="mt-2 text-sm font-medium text-text-primary">
                  Die Dateien enthalten sensible Gesundheitsdaten. Bewahre sie
                  nur an einem geschützten Ort auf.
                </p>
              </div>

              <a
                href="/api/konto/datenexport?format=json"
                className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-forest-strong px-5 py-3 text-center text-sm font-semibold text-surface hover:opacity-90"
              >
                Vollständigen JSON-Export laden
              </a>

              <div className="grid gap-3 sm:grid-cols-2" aria-label="CSV-Exporte">
                {[
                  ["daily-entries", "Tageswerte"],
                  ["nutrition", "Ernährung"],
                  ["training", "Training"],
                  ["labs", "Laborwerte"],
                  ["supplements", "Supplemente"],
                ].map(([dataset, label]) => (
                  <a
                    key={dataset}
                    href={`/api/konto/datenexport?format=csv&dataset=${dataset}`}
                    className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-center text-sm font-semibold text-text-primary hover:bg-surface-muted"
                  >
                    {label} als CSV
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
