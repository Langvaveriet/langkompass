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
import { requireUser } from "@/lib/session";
import {
  dateInTimeZone,
  defaultTimeZone,
  timeInTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

type TageserfassungPageProps = {
  searchParams: Promise<{
    date?: string;
    saved?: string;
    completed?: string;
    error?: string;
  }>;
};

function getSelectedDate(value: string | undefined, timeZone: string): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return dateInTimeZone(new Date(), timeZone);
}

function formatDecimal(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function errorMessage(error: string): string {
  if (error === "date") {
    return "Bitte wähle ein gültiges Datum aus.";
  }

  if (error === "weightKg") {
    return "Das Gewicht muss zwischen 20 und 400 kg liegen.";
  }

  if (error === "weightMeasuredTime") {
    return "Bitte prüfe die Uhrzeit der Gewichtsmessung.";
  }

  if (error === "sleepHours") {
    return "Die Schlafdauer muss zwischen 0 und 24 Stunden liegen.";
  }

  if (error === "painLevel" || error === "stressLevel") {
    return "Schmerzen und Stress müssen zwischen 0 und 10 liegen.";
  }

  if (
    error === "wellbeing" ||
    error === "energy" ||
    error === "sleepQuality"
  ) {
    return "Der ausgewählte Skalenwert muss zwischen 1 und 10 liegen.";
  }

  return "Bitte prüfe Datum und Eingabewerte.";
}

export default async function TageserfassungPage({
  searchParams,
}: TageserfassungPageProps) {
  const query = await searchParams;
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    include: {
      settings: true,
      healthProfile: true,
    },
  });
  const timeZone = user?.settings?.timeZone ?? defaultTimeZone;
  const selectedDate = getSelectedDate(query.date, timeZone);
  const entryDate = new Date(`${selectedDate}T00:00:00.000Z`);

  const entry = user
    ? await prisma.dailyEntry.findUnique({
        where: {
          userId_entryDate: {
            userId: user.id,
            entryDate,
          },
        },
        include: {
          measurements: {
            where: { type: "WEIGHT" },
          },
        },
      })
    : null;

  const [recentEntries, latestWeight] = user
    ? await Promise.all([
        prisma.dailyEntry.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            entryDate: "desc",
          },
          take: 7,
          include: {
            measurements: {
              where: { type: "WEIGHT" },
            },
          },
        }),
        prisma.bodyMeasurement.findFirst({
          where: { userId: user.id, type: "WEIGHT" },
          orderBy: { measuredAt: "desc" },
        }),
      ])
    : [[], null];

  const weightMeasurement = entry?.measurements[0];

  const values: DailyEntryFormValues = {
    status: entry?.status ?? "OPEN",
    entryDate: selectedDate,
    weightKg: formatDecimal(weightMeasurement?.value),
    suggestedWeightKg: formatDecimal(
      latestWeight?.value ?? user?.healthProfile?.weightKg,
    ),
    weightMeasuredTime: weightMeasurement
      ? timeInTimeZone(weightMeasurement.measuredAt, timeZone)
      : timeInTimeZone(new Date(), timeZone),
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
            className="rounded-[var(--radius-md)] border border-border-subtle bg-surface-muted px-4 py-3 text-sm text-text-primary"
          >
            {query.completed === "1"
              ? "Der Tag wurde abgeschlossen."
              : "Der Zwischenstand wurde gespeichert."}
          </div>
        ) : null}

        {query.error ? (
          <div
            role="alert"
            className="mt-8 rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-800"
          >
            {errorMessage(query.error)}
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
              <DailyEntryForm values={values} status={values.status} />
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
                            {recentEntry.measurements[0]
                              ? `${formatDecimal(recentEntry.measurements[0].value).replace(".", ",")} kg`
                              : "Kein Gewicht angegeben"}
                            {" · "}Wohlbefinden: {recentEntry.wellbeing ?? "–"}
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
