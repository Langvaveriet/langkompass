import Link from "next/link";

import {
  DashboardAreaLink,
  NutritionSummaryCard,
  SevenDaySummaryCard,
  SupplementSummaryCard,
  type DashboardAreaCard,
} from "@/components/dashboard/dashboard-summary-cards";
import { TodayMealPlan } from "@/components/dashboard/today-meal-plan";
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
import { PageSubtitle } from "@/components/ui/typography";
import { summarizeCheckIns } from "@/lib/dashboard/check-in-summary";
import { summarizeMealPlan } from "@/lib/dashboard/meal-plan-summary";
import { calculateDailyCalorieTarget } from "@/lib/nutrition/calorie-target";
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
  const sevenDayPeriodStart = localDateTimeToUtc(
    sevenDayStart.toISOString().slice(0, 10),
    "00:00",
    timeZone,
  );
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
    todayMealPlanEntries,
    labMeasurementCount,
    activeSupplementCount,
    recentSupplementIntakes,
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
            waterLiters: true,
            steps: true,
            activeMinutes: true,
          },
          orderBy: { entryDate: "desc" },
        }),
        prisma.trainingSession.findFirst({
          where: { userId: user.id, completedAt: null, cancelledAt: null },
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
        prisma.mealPlanEntry.findMany({
          where: {
            userId: user.id,
            plannedDate: todayEntryDate,
          },
          select: {
            id: true,
            type: true,
            completedAt: true,
            recipe: { select: { name: true } },
          },
          orderBy: { type: "asc" },
        }),
        prisma.labResult.count({
          where: { userId: user.id },
        }),
        prisma.supplement.count({
          where: { userId: user.id, archivedAt: null },
        }),
        prisma.supplementIntake.findMany({
          where: {
            userId: user.id,
            takenAt: { gte: sevenDayPeriodStart, lt: weightPeriodEnd },
          },
          select: { supplementId: true, takenAt: true },
        }),
      ])
    : [null, [], [], null, [], 0, [], 0, 0, []];
  const weightMeasurements = weightMeasurementsDescending.toReversed();
  const latestWeight = weightMeasurements.at(-1);
  const checkInSummary = summarizeCheckIns(recentEntries);
  const mealPlanSummary = summarizeMealPlan(todayMealPlanEntries);
  const todayDate = todayEntryDate.toISOString().slice(0, 10);
  const calorieTargetProfile = profile
    ? {
        ...profile,
        weightKg: latestWeight?.value ?? profile.weightKg,
      }
    : null;
  const calorieTarget = calculateDailyCalorieTarget(
    calorieTargetProfile,
    todayEntryDate,
  );
  const todaySupplementIntakes = recentSupplementIntakes.filter(
    (intake) => intake.takenAt >= todayPeriodStart,
  );
  const todaySupplementIntakeCount = todaySupplementIntakes.length;
  const todaySupplementCount = new Set(
    todaySupplementIntakes.map((intake) => intake.supplementId),
  ).size;
  const dashboardDateLabel = new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone,
  }).format(new Date());
  const mealTypeLabels = {
    BREAKFAST: "Frühstück",
    LUNCH: "Mittagessen",
    DINNER: "Abendessen",
    SNACK: "Snack",
    DRINK: "Getränk",
  } as const;

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

  const overviewCards: DashboardAreaCard[] = [
    {
      eyebrow: "Heute",
      title: "Tageserfassung",
      value: dailyEntryStatus,
      description:
        "Schlaf, Energie, Bewegung, Beschwerden und Wohlbefinden ergänzen.",
      href: "/tageserfassung",
    },
    {
      eyebrow: "Bewegung",
      title: "Training",
      value: trainingStatus,
      description: trainingDescription,
      href: "/training",
    },
    {
      eyebrow: "Diagnostik",
      title: "Laborwerte",
      value: labMeasurementCount > 0
        ? `${labMeasurementCount} ${labMeasurementCount === 1 ? "Messung" : "Messungen"}`
        : "Noch keine Messungen",
      description:
        "Laborergebnisse strukturiert erfassen und Veränderungen vergleichen.",
      href: "/laborwerte",
    },
    {
      eyebrow: "Persönliche Basis",
      title: "Gesundheitsprofil",
      value: profile
        ? `${profileProgress} % vollständig`
        : "Noch nicht eingerichtet",
      description: profile
        ? "Basisdaten, Zielwerte und Gesundheitsziele aktuell halten."
        : "Basisdaten, Gesundheitsziele und relevante Rahmenbedingungen ergänzen.",
      href: "/gesundheitsprofil",
    },
    {
      eyebrow: "Lokale Auswertung",
      title: "Compass AI",
      value: profile ? "Profilkontext verfügbar" : "Bereit für Kontext",
      description:
        "Zusammenhänge aus deinen strukturierten Daten lokal einordnen.",
      href: "/compass-ai",
    },
  ];

  return (
    <AppLayout>
      <Page>
        <header className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border-subtle bg-surface-raised px-6 py-7 shadow-sm sm:px-8 sm:py-9">
          <div
            className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-forest-soft opacity-80 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-copper-soft opacity-60 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copper">
              {dashboardDateLabel}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-forest-strong sm:text-5xl">
              Dein Gesundheitskompass
            </h1>
            <PageSubtitle className="mt-4 max-w-3xl">
              Die wichtigsten Entwicklungen zuerst – ruhig, klar und auf Basis
              deiner tatsächlich erfassten Daten.
            </PageSubtitle>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/tageserfassung"
                className="inline-flex min-h-11 items-center rounded-full bg-forest-soft px-4 py-2 text-sm font-semibold text-forest-strong transition hover:opacity-80"
              >
                {dailyEntryStatus} →
              </Link>
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-subtle bg-surface-raised/80 px-4 py-2 text-sm font-medium text-text-secondary">
                {profileProgress} % Profilkontext
              </span>
            </div>
          </div>
        </header>

        <Section
          aria-label="Wichtige Gesundheitsdaten"
          className="!mt-6 grid grid-cols-12 gap-5"
        >
          <div className="col-span-12 xl:col-span-7">
            <WeightTrend
              measurements={weightMeasurements}
              timeZone={timeZone}
            />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <SevenDaySummaryCard summary={checkInSummary} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <NutritionSummaryCard
              mealCount={todayMealCount}
              energyKcal={todayEnergyKcal}
              calorieTarget={calorieTarget}
              plannedCount={mealPlanSummary.plannedCount}
              completedPlannedCount={mealPlanSummary.completedCount}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <SupplementSummaryCard
              activeCount={activeSupplementCount}
              todayIntakeCount={todaySupplementIntakeCount}
              todaySupplementCount={todaySupplementCount}
              sevenDayIntakeCount={recentSupplementIntakes.length}
            />
          </div>
        </Section>

        {mealPlanSummary.plannedCount > 0 ? (
          <Section aria-label="Heutiger Mahlzeitenplan">
            <TodayMealPlan
              date={todayDate}
              completedCount={mealPlanSummary.completedCount}
              items={todayMealPlanEntries.map((entry) => ({
                id: entry.id,
                mealType: mealTypeLabels[entry.type],
                recipeName: entry.recipe.name,
                completed: entry.completedAt !== null,
              }))}
            />
          </Section>
        ) : null}

        <Section aria-labelledby="weitere-bereiche-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">
                Überblick
              </p>
              <h2
                id="weitere-bereiche-title"
                className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-text-primary"
              >
                Weitere Bereiche
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {overviewCards.map((card) => (
              <DashboardAreaLink key={card.title} card={card} />
            ))}
          </div>
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
                {mealPlanSummary.plannedCount === 0 ? (
                  <li>
                    <Link
                      href={`/ernaehrung/wochenplan?date=${todayDate}`}
                      className="font-semibold text-forest-strong"
                    >
                      Heutige Mahlzeiten planen →
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
                {activeSupplementCount === 0 ? (
                  <li>
                    <Link href="/supplemente" className="font-semibold text-forest-strong">
                      Erstes Supplement anlegen →
                    </Link>
                  </li>
                ) : null}
                {profileProgress === 100 &&
                todayEntry &&
                todayMealCount > 0 &&
                mealPlanSummary.plannedCount > 0 &&
                activeSupplementCount > 0 &&
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
