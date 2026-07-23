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
import { estimatedFoodEnergy } from "@/lib/nutrition/energy";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";


function getTodayEntryDate(): Date {
  const localDate = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return new Date(`${localDate}T00:00:00.000Z`);
}

export default async function HomePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    include: {
      healthProfile: true,
    },
  });

  const profile = user?.healthProfile;

  const todayEntry = user
    ? await prisma.dailyEntry.findUnique({
        where: {
          userId_entryDate: {
            userId: user.id,
            entryDate: getTodayEntryDate(),
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
      })
    : null;

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

  const completedProfileFields = [
    profile?.firstName,
    profile?.lastName,
    profile?.dateOfBirth,
    profile?.heightCm,
    profile?.weightKg,
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
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5"
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
                {!profile ? (
                  <li>Gesundheitsprofil vervollständigen</li>
                ) : null}

                {!todayEntry ? <li>Erste Tageserfassung anlegen</li> : null}
                {todayMealCount === 0 ? <li>Erste Mahlzeit erfassen</li> : null}
                <li>Laborbericht hinzufügen</li>
              </ul>
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
