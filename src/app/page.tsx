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
import { Card } from "@/components/ui/card";
import { PageSubtitle } from "@/components/ui/typography";
import { summarizeCheckIns } from "@/lib/dashboard/check-in-summary";
import { buildDailyReminders } from "@/lib/dashboard/daily-reminders";
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
    labReports,
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
            sleepHours: true,
            energy: true,
            wellbeing: true,
            waterLiters: true,
            steps: true,
            activeMinutes: true,
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
        prisma.labReport.findMany({
          where: { userId: user.id },
          select: {
            collectedAt: true,
            _count: { select: { results: true } },
          },
          orderBy: { collectedAt: "desc" },
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
    : [null, [], [], null, [], 0, [], [], 0, []];
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
  const hasWeightMeasurementToday = weightMeasurementsDescending.some(
    (measurement) =>
      measurement.measuredAt >= todayPeriodStart &&
      measurement.measuredAt < weightPeriodEnd,
  );
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
  const labMeasurementCount = labReports.reduce(
    (sum, report) => sum + report._count.results,
    0,
  );
  const latestLabDate = labReports[0]
    ? new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        timeZone,
      }).format(labReports[0].collectedAt)
    : "–";
  const calorieTargetLabel = calorieTarget
    ? `${calorieTarget.toLocaleString("de-DE")} kcal`
    : "–";
  const latestWeightLabel = latestWeight
    ? `${Number(latestWeight.value).toFixed(1).replace(".", ",")} kg`
    : "–";
  const todaySleepLabel = todayEntry?.sleepHours
    ? `${Number(todayEntry.sleepHours).toFixed(1).replace(".", ",")} Std.`
    : "–";
  const todayWaterLabel = todayEntry?.waterLiters
    ? `${Number(todayEntry.waterLiters).toFixed(1).replace(".", ",")} l`
    : "–";

  const overviewCards: DashboardAreaCard[] = [
    {
      eyebrow: "Heute",
      title: "Tageserfassung",
      value: dailyEntryStatus,
      href: "/tageserfassung",
      metrics: [
        { label: "Schlaf", value: todaySleepLabel },
        {
          label: "Energie",
          value: todayEntry?.energy ? `${todayEntry.energy} / 10` : "–",
        },
        {
          label: "Schritte",
          value: todayEntry?.steps?.toLocaleString("de-DE") ?? "–",
        },
        {
          label: "Aktive Zeit",
          value: todayEntry?.activeMinutes
            ? `${todayEntry.activeMinutes} Min.`
            : "–",
        },
        {
          label: "Wohlbefinden",
          value: todayEntry?.wellbeing
            ? `${todayEntry.wellbeing} / 10`
            : "–",
        },
        { label: "Trinkmenge", value: todayWaterLabel },
      ],
    },
    {
      eyebrow: "Bewegung",
      title: "Training",
      value: trainingStatus,
      href: "/training",
      metrics: [
        {
          label: "Einheiten heute",
          value: todayTrainingSessions.length.toLocaleString("de-DE"),
        },
        {
          label: "Sätze heute",
          value: todayTrainingSetCount.toLocaleString("de-DE"),
        },
        {
          label: "Trainingspläne",
          value: trainingPlanCount.toLocaleString("de-DE"),
        },
      ],
    },
    {
      eyebrow: "Diagnostik",
      title: "Laborwerte",
      value: labMeasurementCount > 0
        ? `${labMeasurementCount} ${labMeasurementCount === 1 ? "Messung" : "Messungen"}`
        : "Noch keine Messungen",
      href: "/laborwerte",
      metrics: [
        {
          label: "Untersuchungen",
          value: labReports.length.toLocaleString("de-DE"),
        },
        { label: "Letzte Untersuchung", value: latestLabDate },
      ],
    },
    {
      eyebrow: "Persönliche Basis",
      title: "Gesundheitsprofil",
      value: profile
        ? `${profileProgress} % vollständig`
        : "Noch nicht eingerichtet",
      href: "/gesundheitsprofil",
      metrics: [
        { label: "Aktuelles Gewicht", value: latestWeightLabel },
        { label: "Tagesziel", value: calorieTargetLabel },
      ],
    },
    {
      eyebrow: "Lokale Auswertung",
      title: "Compass AI",
      value: profile ? "Profilkontext verfügbar" : "Bereit für Kontext",
      href: "/compass-ai",
      metrics: [
        {
          label: "Check-ins · 7 Tage",
          value: `${checkInSummary.recordedDays} / 7`,
        },
        {
          label: "Gewichtswerte · 30 Tage",
          value: weightMeasurements.length.toLocaleString("de-DE"),
        },
        {
          label: "Laborwerte",
          value: labMeasurementCount.toLocaleString("de-DE"),
        },
      ],
    },
  ];
  const nextSteps = [
    ...(profileProgress < 100
      ? [{ href: "/gesundheitsprofil", label: "Profil vervollständigen" }]
      : []),
    ...(!todayEntry
      ? [{ href: "/tageserfassung", label: "Check-in beginnen" }]
      : []),
    ...(todayMealCount === 0
      ? [{ href: "/ernaehrung", label: "Erste Mahlzeit erfassen" }]
      : []),
    ...(mealPlanSummary.plannedCount === 0
      ? [
          {
            href: `/ernaehrung/wochenplan?date=${todayDate}`,
            label: "Mahlzeiten planen",
          },
        ]
      : []),
  ];
  const headerReminders = buildDailyReminders({
    date: todayDate,
    hasWeightMeasurement: hasWeightMeasurementToday,
    supplementIntakeCount: todaySupplementIntakeCount,
    activeSupplementCount,
  });

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

            {headerReminders.length > 0 ? (
              <div
                className="mt-6 grid gap-3 sm:grid-cols-2"
                aria-label="Offene Erinnerungen für heute"
              >
                {headerReminders.map((reminder) => (
                  <Link
                    key={reminder.key}
                    href={reminder.href}
                    className="group flex min-h-20 items-center gap-3 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised/90 p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-forest-strong hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-2"
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-copper-soft text-sm font-semibold text-copper"
                      aria-hidden="true"
                    >
                      {reminder.marker}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-copper">
                        {reminder.eyebrow}
                      </span>
                      <span className="mt-0.5 block font-semibold text-text-primary">
                        {reminder.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-text-muted">
                        {reminder.detail}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-forest-strong">
                      <span className="hidden xl:inline">{reminder.action} </span>→
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <Section aria-label="Nächste Schritte" className="!mt-4">
          <Card className="overflow-hidden">
            <div className="flex min-h-14 items-center gap-4 px-4 py-2.5 sm:px-5">
              <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-copper">
                Nächste Schritte
              </p>
              <div className="h-5 w-px shrink-0 bg-border-subtle" aria-hidden="true" />
              {nextSteps.length > 0 ? (
                <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
                  {nextSteps.map((step) => (
                    <Link
                      key={`${step.href}-${step.label}`}
                      href={step.href}
                      className="shrink-0 rounded-full bg-forest-soft px-3 py-1.5 text-sm font-semibold text-forest-strong transition hover:opacity-80"
                    >
                      {step.label} →
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-medium text-forest-strong">
                  Alles Wichtige für heute ist erfasst.
                </p>
              )}
            </div>
          </Card>
        </Section>

        <Section
          aria-label="Wichtige Gesundheitsdaten"
          className="!mt-6 grid grid-cols-12 gap-5"
        >
          <div className="col-span-12 md:col-span-6 2xl:col-span-3">
            <WeightTrend
              measurements={weightMeasurements}
              timeZone={timeZone}
            />
          </div>
          <div className="col-span-12 md:col-span-6 2xl:col-span-3">
            <SevenDaySummaryCard summary={checkInSummary} />
          </div>
          <div className="col-span-12 md:col-span-6 2xl:col-span-3">
            <NutritionSummaryCard
              mealCount={todayMealCount}
              energyKcal={todayEnergyKcal}
              calorieTarget={calorieTarget}
              plannedCount={mealPlanSummary.plannedCount}
              completedPlannedCount={mealPlanSummary.completedCount}
            />
          </div>
          <div className="col-span-12 md:col-span-6 2xl:col-span-3">
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
      </Page>
    </AppLayout>
  );
}
