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
        </Section>
      </Page>
    </AppLayout>
  );
}
