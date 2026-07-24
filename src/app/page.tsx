import Link from "next/link";

import { WeightTrend } from "@/components/dashboard/weight-trend";
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
import { summarizeCheckIns } from "@/lib/dashboard/check-in-summary";
import { estimatedFoodEnergy } from "@/lib/nutrition/energy";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  dateInTimeZone,
  defaultTimeZone,
  localDateTimeToUtc,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

function getTodayEntryDate(timeZone: string): Date {
  const localDate = dateInTimeZone(new Date(), timeZone);
  return new Date(`${localDate}T00:00:00.000Z`);
}

function addUtcDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function formatAverage(value: number | null, suffix = ""): string {
  return value === null ? "–" : `${value.toFixed(1).replace(".", ",")}${suffix}`;
}

export default async function HomePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    include: {
      healthProfile: true,
      settings: true,
    },
  });

  const profile = user?.healthProfile;
  const timeZone = user?.settings?.timeZone ?? defaultTimeZone;
  const todayEntryDate = getTodayEntryDate(timeZone);
  const sevenDayStart = addUtcDays(todayEntryDate, -6);
  const weightStartDate = addUtcDays(todayEntryDate, -29)
    .toISOString()
    .slice(0, 10);
  const weightPeriodStart = localDateTimeToUtc(
    weightStartDate,
    "00:00",
    timeZone,
  );
  const todayPeriodStart = localDateTimeToUtc(
    todayEntryDate.toISOString().slice(0, 10),
    "00:00",
    timeZone,
  );
  const tomorrowDate = addUtcDays(todayEntryDate, 1)
    .toISOString()
    .slice(0, 10);
  const weightPeriodEnd = localDateTimeToUtc(
    tomorrowDate,
    "00:00",
    timeZone,
  );

  const [
    todayEntry,
    weightMeasurementsDescending,
    recentEntries,
    activeTrainingSession,
    todayTrainingSessions,
    trainingPlanCount,
  ] = user
    ? await Promise.all([
        prisma.dailyEntry.findUnique({
          where: {
            userId_entryDate: {
              userId: user.id,
              entryDate: todayEntryDate,
            },
          },
          select: {
            id: true,
            status: true,
            meals: {
              select: {
                id: true,
                items: {
                  select: {
                    energyKcal: true,
                    foodKey: true,
                    quantity: true,
                  },
                },
              },
            },
          },
        }),
        prisma.bodyMeasurement.findMany({
          where: {
            userId: user.id,
            type: "WEIGHT",
            measuredAt: { gte: weightPeriodStart, lt: weightPeriodEnd },
          },
          select: { id: true, value: true, measuredAt: true },
          orderBy: { measuredAt: "desc" },
        }),
        prisma.dailyEntry.findMany({
          where: {
            userId: user.id,
            entryDate: { gte: sevenDayStart, lte: todayEntryDate },
          },
          select: {
            status: true,
            sleepHours: true,
            energy: true,
            wellbeing: true,
          },
          orderBy: { entryDate: "desc" },
        }),
        prisma.trainingSession.findFirst({
          where: { userId: user.id, completedAt: null },
          orderBy: { startedAt: "desc" },
          select: {
            planName: true,
            _count: { select: { sets: true } },
          },
        }),
        prisma.trainingSession.findMany({
          where: {
            userId: user.id,
            completedAt: { gte: todayPeriodStart, lt: weightPeriodEnd },
          },
          orderBy: { completedAt: "desc" },
          select: {
            planName: true,
            _count: { select: { sets: true } },
          },
        }),
        prisma.trainingPlan.count({
          where: { userId: user.id, archivedAt: null },
        }),
      ])
    : [null, [], [], null, [], 0];
  const weightMeasurements = weightMeasurementsDescending.toReversed();
  const latestWeight = weightMeasurements.at(-1);
  const checkInSummary = summarizeCheckIns(recentEntries);

  const todayMealCount = todayEntry?.meals.length ?? 0;
  const todayEnergyKcal = Math.round(
    todayEntry?.meals.reduce(
      (mealSum, meal) =>
        mealSum +
        meal.items.reduce(
          (itemSum, item) => itemSum + (estimatedFoodEnergy(item) ?? 0),
          0,
        ),
      0,
    ) ?? 0,
  );

  const dailyEntryStatus = (() => {
    switch (todayEntry?.status) {
      case "COMPLETED":
        return "Tag abgeschlossen";
      case "MORNING_DONE":
        return "Morgen-Check erledigt";
      case "OPEN":
        return "Heute begonnen";
      default:
        return "Heute noch offen";
    }
  })();

  const todayTrainingSetCount = todayTrainingSessions.reduce(
    (sum, session) => sum + session._count.sets,
    0,
  );
  const trainingStatus = activeTrainingSession
    ? `${activeTrainingSession.planName ?? "Training"} läuft · ${activeTrainingSession._count.sets} ${activeTrainingSession._count.sets === 1 ? "Satz" : "Sätze"}`
    : todayTrainingSessions.length > 1
      ? `${todayTrainingSessions.length} Trainings heute · ${todayTrainingSetCount} Sätze`
      : todayTrainingSessions.length === 1
        ? `${todayTrainingSessions[0].planName ?? "Training"} abgeschlossen · ${todayTrainingSetCount} ${todayTrainingSetCount === 1 ? "Satz" : "Sätze"}`
        : trainingPlanCount > 0
          ? `${trainingPlanCount} ${trainingPlanCount === 1 ? "Trainingsplan" : "Trainingspläne"} bereit`
          : "Noch kein Trainingsplan";
  const trainingDescription = activeTrainingSession
    ? "Deine laufende Einheit fortsetzen und den nächsten Satz direkt erfassen."
    : todayTrainingSessions.length > 0
      ? "Die heutige Aktivität ist dokumentiert und fließt in deinen Trainingsverlauf ein."
      : trainingPlanCount > 0
        ? "Einen vorbereiteten Trainingsplan wählen und die Einheit mit wenigen Handgriffen starten."
        : "Wiederverwendbare Trainingspläne mit einer grafischen Übungsauswahl zusammenstellen.";

  const completedProfileFields = [
    profile?.firstName,
    profile?.lastName,
    profile?.dateOfBirth,
    profile?.heightCm,
    profile?.weightKg ?? latestWeight?.value,
    profile?.calorieFormulaSex,
    profile?.activityLevel,
    profile?.weightGoal,
    profile?.primaryGoal,
    profile?.activityGoal,
  ].filter((value) => value !== null && value !== undefined && value !== "")
    .length;

  const totalProfileFields = 10;
  const profileProgress = Math.round(
    (completedProfileFields / totalProfileFields) * 100,
  );

  const overviewCards = [
    {
      title: "Gesundheitsprofil",
      value: profile
        ? `${profileProgress} % vollständig`
        : "Noch nicht eingerichtet",
      description: profile
        ? "Persönliche Basisdaten und Gesundheitsziele sind bereits gespeichert."
        : "Persönliche Basisdaten, Gesundheitsziele und relevante Rahmenbedingungen.",
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
      value: profile ? "Profilkontext verfügbar" : "Bereit für Kontext",
      description:
        "Ruhige, verständliche Einordnung auf Basis deiner freigegebenen Gesundheitsdaten.",
      href: "/compass-ai",
    },
    {
      title: "Tageserfassung",
      value: dailyEntryStatus,
      description:
        "Wohlbefinden, Symptome, Schlaf und persönliche Beobachtungen dokumentieren.",
      href: "/tageserfassung",
    },
    {
      title: "Ernährung",
      value: todayMealCount > 0
        ? `${todayMealCount} ${todayMealCount === 1 ? "Eintrag" : "Einträge"} · ca. ${todayEnergyKcal} kcal`
        : "Heute noch nichts erfasst",
      description:
        "Mahlzeiten, Getränke und mögliche Reaktionen strukturiert dokumentieren.",
      href: "/ernaehrung",
    },
    {
      title: "Training",
      value: trainingStatus,
      description: trainingDescription,
      href: "/training",
    },
  ];

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
          className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
          {overviewCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-4"
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
          aria-label="Gesundheitsverlauf"
          className="grid grid-cols-12 gap-5"
        >
          <div className="col-span-12 xl:col-span-8">
            <WeightTrend
              measurements={weightMeasurements}
              timeZone={timeZone}
            />
          </div>

          <Card className="col-span-12 xl:col-span-4">
            <CardHeader>
              <CardTitle>Letzte 7 Tage</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5">
              <p className="text-sm leading-6 text-text-muted">
                Zusammenfassung aus deinen tatsächlich erfassten Check-ins.
              </p>

              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                  <dt className="text-xs text-text-muted">Erfasste Tage</dt>
                  <dd className="mt-1 text-lg font-semibold text-text-primary">
                    {checkInSummary.recordedDays} / 7
                  </dd>
                </div>
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                  <dt className="text-xs text-text-muted">Abgeschlossen</dt>
                  <dd className="mt-1 text-lg font-semibold text-text-primary">
                    {checkInSummary.completedDays}
                  </dd>
                </div>
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                  <dt className="text-xs text-text-muted">Ø Schlaf</dt>
                  <dd className="mt-1 text-lg font-semibold text-text-primary">
                    {formatAverage(checkInSummary.averageSleepHours, " Std.")}
                  </dd>
                </div>
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                  <dt className="text-xs text-text-muted">Ø Energie</dt>
                  <dd className="mt-1 text-lg font-semibold text-text-primary">
                    {formatAverage(checkInSummary.averageEnergy, " / 10")}
                  </dd>
                </div>
              </dl>

              {checkInSummary.averageWellbeing !== null ? (
                <p className="text-xs leading-5 text-text-muted">
                  Durchschnittliches Wohlbefinden am Abend:{" "}
                  {formatAverage(
                    checkInSummary.averageWellbeing,
                    " / 10",
                  )}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </Section>

        <Section aria-label="Nächste Schritte">
          <Card>
            <CardHeader>
              <CardTitle>Nächste Schritte</CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="grid gap-3 text-sm">
                {profileProgress < 100 ? (
                  <li>
                    <Link
                      href="/gesundheitsprofil"
                      className="font-semibold text-forest-strong"
                    >
                      Gesundheitsprofil vervollständigen →
                    </Link>
                  </li>
                ) : null}

                {!todayEntry ? (
                  <li>
                    <Link
                      href="/tageserfassung"
                      className="font-semibold text-forest-strong"
                    >
                      Heutigen Check-in beginnen →
                    </Link>
                  </li>
                ) : null}
                {todayMealCount === 0 ? (
                  <li>
                    <Link
                      href="/ernaehrung"
                      className="font-semibold text-forest-strong"
                    >
                      Erste Mahlzeit heute erfassen →
                    </Link>
                  </li>
                ) : null}
                {weightMeasurements.length < 2 ? (
                  <li>
                    <Link
                      href="/tageserfassung"
                      className="font-semibold text-forest-strong"
                    >
                      Weiteren Gewichtswert erfassen →
                    </Link>
                  </li>
                ) : null}
                {profileProgress === 100 &&
                todayEntry &&
                todayMealCount > 0 &&
                weightMeasurements.length >= 2 ? (
                  <li className="text-text-muted">
                    Alles Wichtige für heute ist erfasst.
                  </li>
                ) : null}
              </ul>
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
