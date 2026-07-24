import Link from "next/link";

import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { Section } from "@/components/layout/section";
import { ExerciseProgress } from "@/components/training/exercise-progress";
import { ExerciseThumbnail } from "@/components/training/exercise-thumbnail";
import { PersonalRecords } from "@/components/training/personal-records";
import { Card, CardContent } from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { exerciseVisualByNormalizedName } from "@/lib/training/exercise-catalog";
import { buildExerciseProgress } from "@/lib/training/exercise-progress";
import { buildPersonalTrainingRecords } from "@/lib/training/personal-records";
import {
  defaultLocale,
  defaultTimeZone,
  timeInTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

type TrainingHistoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryValue(
  query: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function TrainingHistoryPage({
  searchParams,
}: TrainingHistoryPageProps) {
  const user = await requireUser();
  const [query, sessions, settings, recordSummaries, recordExercises] =
    await Promise.all([
      searchParams,
      prisma.trainingSession.findMany({
        where: { userId: user.id, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
        take: 30,
        include: {
          sets: {
            orderBy: { createdAt: "asc" },
            include: {
              exercise: {
                select: { id: true, name: true, normalizedName: true },
              },
            },
          },
        },
      }),
      prisma.userSettings.findUnique({
        where: { userId: user.id },
        select: { timeZone: true, locale: true },
      }),
      prisma.trainingSet.groupBy({
        by: ["exerciseId"],
        where: {
          userId: user.id,
          trainingSession: { completedAt: { not: null } },
        },
        _max: { weightKg: true, repetitions: true },
        _count: { _all: true },
      }),
      prisma.exercise.findMany({
        where: { userId: user.id },
        select: { id: true, name: true, normalizedName: true },
      }),
    ]);
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const locale = settings?.locale ?? defaultLocale;
  const totalSets = sessions.reduce(
    (sum, session) => sum + session.sets.length,
    0,
  );
  const personalRecords = buildPersonalTrainingRecords(
    recordSummaries.map((summary) => ({
      exerciseId: summary.exerciseId,
      maximumWeightKg: summary._max.weightKg?.toNumber() ?? null,
      maximumRepetitions: summary._max.repetitions,
      setCount: summary._count._all,
    })),
    recordExercises,
  );
  const requestedExerciseId = queryValue(query, "exercise");
  const selectedExercise =
    personalRecords.find(
      (record) => record.exerciseId === requestedExerciseId,
    ) ?? personalRecords[0];
  const progressSessions = selectedExercise
    ? await prisma.trainingSession.findMany({
        where: {
          userId: user.id,
          completedAt: { not: null },
          sets: { some: { exerciseId: selectedExercise.exerciseId } },
        },
        orderBy: { completedAt: "desc" },
        take: 12,
        select: {
          id: true,
          startedAt: true,
          completedAt: true,
          sets: {
            where: { exerciseId: selectedExercise.exerciseId },
            select: { repetitions: true, weightKg: true },
          },
        },
      })
    : [];
  const exerciseProgress = buildExerciseProgress(
    progressSessions.map((session) => ({
      id: session.id,
      completedAt: session.completedAt ?? session.startedAt,
      sets: session.sets.map((set) => ({
        repetitions: set.repetitions,
        weightKg: set.weightKg?.toNumber() ?? null,
      })),
    })),
  );

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <Link
            href="/training"
            className="text-sm font-semibold text-forest-strong"
          >
            ← Zurück zum Training
          </Link>
          <PageTitle className="mt-4">Trainingsverlauf</PageTitle>
          <PageSubtitle className="mt-4">
            Vergleiche deine absolvierten Einheiten, Übungen und Satzwerte ohne
            zusätzliche Eingaben.
          </PageSubtitle>
        </header>

        <Section aria-label="Zusammenfassung des Trainingsverlaufs">
          <dl className="grid grid-cols-2 gap-3 sm:max-w-xl">
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
              <dt className="text-xs text-text-muted">Einheiten</dt>
              <dd className="mt-1 text-xl font-semibold text-text-primary">
                {sessions.length}
              </dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
              <dt className="text-xs text-text-muted">Erfasste Sätze</dt>
              <dd className="mt-1 text-xl font-semibold text-text-primary">
                {totalSets}
              </dd>
            </div>
          </dl>
        </Section>

        <PersonalRecords records={personalRecords} locale={locale} />

        {selectedExercise ? (
          <ExerciseProgress
            exercises={personalRecords.map((record) => ({
              id: record.exerciseId,
              name: record.exerciseName,
              normalizedName: record.normalizedName,
            }))}
            selectedExercise={{
              id: selectedExercise.exerciseId,
              name: selectedExercise.exerciseName,
              normalizedName: selectedExercise.normalizedName,
            }}
            progress={exerciseProgress}
            locale={locale}
            timeZone={timeZone}
          />
        ) : null}

        <Section aria-label="Abgeschlossene Trainingseinheiten">
          {sessions.length === 0 ? (
            <Card>
              <CardContent>
                <p className="font-semibold text-text-primary">
                  Noch keine abgeschlossene Einheit
                </p>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Sobald du ein Training abschließt, erscheinen die Übungen und
                  Sätze automatisch hier.
                </p>
                <Link
                  href="/training"
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-forest-strong"
                >
                  Training öffnen →
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session, sessionIndex) => {
                const completedAt = session.completedAt ?? session.startedAt;
                const durationMinutes = Math.max(
                  1,
                  Math.round(
                    (completedAt.getTime() - session.startedAt.getTime()) /
                      60000,
                  ),
                );
                const exercises = new Map<
                  string,
                  {
                    id: string;
                    name: string;
                    normalizedName: string;
                    sets: typeof session.sets;
                  }
                >();

                for (const set of session.sets) {
                  const existing = exercises.get(set.exerciseId);

                  if (existing) {
                    existing.sets.push(set);
                  } else {
                    exercises.set(set.exerciseId, {
                      id: set.exercise.id,
                      name: set.exercise.name,
                      normalizedName: set.exercise.normalizedName,
                      sets: [set],
                    });
                  }
                }

                return (
                  <Card key={session.id}>
                    <details open={sessionIndex === 0} className="group">
                      <summary className="flex min-h-24 cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6">
                        <div>
                          <p className="font-semibold text-text-primary">
                            {session.planName ?? "Freies Training"}
                          </p>
                          <p className="mt-1 text-sm text-text-muted">
                            {new Intl.DateTimeFormat(locale, {
                              timeZone,
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }).format(session.startedAt)}
                            {" · "}
                            {timeInTimeZone(session.startedAt, timeZone)} Uhr
                          </p>
                          <p className="mt-2 text-xs text-text-muted">
                            {exercises.size}{" "}
                            {exercises.size === 1 ? "Übung" : "Übungen"} ·{" "}
                            {session.sets.length}{" "}
                            {session.sets.length === 1 ? "Satz" : "Sätze"} ·{" "}
                            {durationMinutes} Min.
                          </p>
                        </div>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-soft text-xl font-semibold text-forest-strong transition group-open:rotate-45">
                          +
                        </span>
                      </summary>

                      <div className="grid gap-3 border-t border-border-subtle p-4 sm:p-6">
                        {exercises.size === 0 ? (
                          <p className="text-sm text-text-muted">
                            Für diese Einheit wurden keine Sätze gespeichert.
                          </p>
                        ) : (
                          Array.from(exercises.values()).map((exercise) => (
                            <article
                              key={exercise.id}
                              className="rounded-[var(--radius-md)] bg-surface-muted p-3"
                            >
                              <div className="flex items-center gap-3">
                                <ExerciseThumbnail
                                  name={exercise.name}
                                  visual={exerciseVisualByNormalizedName.get(
                                    exercise.normalizedName,
                                  )}
                                />
                                <div>
                                  <h2 className="text-sm font-semibold text-text-primary">
                                    {exercise.name}
                                  </h2>
                                  <p className="mt-0.5 text-xs text-text-muted">
                                    {exercise.sets.length}{" "}
                                    {exercise.sets.length === 1
                                      ? "Satz"
                                      : "Sätze"}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                {exercise.sets.map((set) => (
                                  <div
                                    key={set.id}
                                    className="min-w-28 shrink-0 rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary px-3 py-2"
                                  >
                                    <p className="text-xs font-semibold text-text-primary">
                                      Satz {set.setNumber}
                                    </p>
                                    <p className="mt-1 text-xs text-text-muted">
                                      {set.repetitions} Wdh.
                                      {set.weightKg
                                        ? ` · ${set.weightKg.toString().replace(".", ",")} kg`
                                        : " · Körpergewicht"}
                                    </p>
                                    {set.effort ? (
                                      <p className="mt-1 text-xs text-text-muted">
                                        Anstrengung {set.effort}/10
                                      </p>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </article>
                          ))
                        )}
                      </div>
                    </details>
                  </Card>
                );
              })}
            </div>
          )}
        </Section>
      </Page>
    </AppLayout>
  );
}
