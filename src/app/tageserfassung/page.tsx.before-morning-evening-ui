import Link from "next/link";

import {
  DailyEntryForm,
  type DailyEntryFormValues,
} from "@/components/daily-entry/daily-entry-form";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { Section } from "@/components/layout/section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageSubtitle,
  PageTitle,
} from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const LOCAL_USER_EMAIL = "local-user@langkompass.invalid";

type TageserfassungPageProps = {
  searchParams: Promise<{
    date?: string;
    saved?: string;
    error?: string;
  }>;
};

function getTodayInSweden(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getSelectedDate(value?: string): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return getTodayInSweden();
}

function formatDecimal(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export default async function TageserfassungPage({
  searchParams,
}: TageserfassungPageProps) {
  const query = await searchParams;
  const selectedDate = getSelectedDate(query.date);
  const entryDate = new Date(`${selectedDate}T00:00:00.000Z`);

  const user = await prisma.user.findUnique({
    where: {
      email: LOCAL_USER_EMAIL,
    },
  });

  const entry = user
    ? await prisma.dailyEntry.findUnique({
        where: {
          userId_entryDate: {
            userId: user.id,
            entryDate,
          },
        },
      })
    : null;

  const recentEntries = user
    ? await prisma.dailyEntry.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          entryDate: "desc",
        },
        take: 7,
      })
    : [];

  const values: DailyEntryFormValues = {
    entryDate: selectedDate,
    wellbeing: entry?.wellbeing ?? null,
    energy: entry?.energy ?? null,
    sleepHours: formatDecimal(entry?.sleepHours),
    sleepQuality: entry?.sleepQuality ?? null,
    painLevel: entry?.painLevel ?? 0,
    stressLevel: entry?.stressLevel ?? 0,
    symptomTags: entry?.symptomTags ?? [],
    activityTags: entry?.activityTags ?? [],
    notes: entry?.notes ?? "",
  };

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Tageserfassung</PageTitle>

          <PageSubtitle className="mt-4">
            Wohlbefinden, Schlaf, Schmerzen und persönliche Beobachtungen
            strukturiert dokumentieren.
          </PageSubtitle>
        </header>

        {query.saved === "1" ? (
          <div
            role="status"
            className="mt-8 rounded-[var(--radius-md)] border border-forest-strong bg-forest-soft px-5 py-4 text-sm font-medium text-forest-strong"
          >
            Die Tageserfassung für {selectedDate} wurde gespeichert.
          </div>
        ) : null}

        {query.error ? (
          <div
            role="alert"
            className="mt-8 rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-800"
          >
            Bitte prüfe Datum und Eingabewerte. Skalenwerte müssen zwischen 1
            und 10 liegen.
          </div>
        ) : null}

        <Section
          aria-label="Tageserfassung"
          className="grid grid-cols-12 gap-5"
        >
          <Card className="col-span-12 xl:col-span-8">
            <CardHeader>
              <CardTitle>
                {entry
                  ? "Tageserfassung bearbeiten"
                  : "Neue Tageserfassung"}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <DailyEntryForm values={values} />
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-4">
            <CardHeader>
              <CardTitle>Letzte Einträge</CardTitle>
            </CardHeader>

            <CardContent>
              {recentEntries.length === 0 ? (
                <p className="text-sm leading-6 text-text-muted">
                  Bisher wurden noch keine Tageserfassungen gespeichert.
                </p>
              ) : (
                <ul className="grid gap-3">
                  {recentEntries.map((recentEntry) => {
                    const date = recentEntry.entryDate
                      .toISOString()
                      .slice(0, 10);

                    return (
                      <li key={recentEntry.id}>
                        <Link
                          href={`/tageserfassung?date=${date}`}
                          className="block rounded-[var(--radius-md)] border border-border-subtle px-4 py-3 transition hover:border-forest-strong hover:bg-surface-muted"
                        >
                          <p className="text-sm font-semibold text-text-primary">
                            {date}
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            Wohlbefinden:{" "}
                            {recentEntry.wellbeing ?? "nicht angegeben"}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
