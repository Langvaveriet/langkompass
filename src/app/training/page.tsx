import Link from "next/link";

import { setExerciseArchived } from "@/app/training/actions";
import {
  ExerciseForm,
  type ExerciseFormValues,
} from "@/components/training/exercise-form";
import { ExerciseQuickAdd } from "@/components/training/exercise-quick-add";
import { TrainingSessionCard } from "@/components/training/training-session-card";
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
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  defaultLocale,
  defaultTimeZone,
  timeInTimeZone,
} from "@/lib/user-settings";
import {
  exerciseCategoryLabels,
  exerciseEquipmentLabels,
  muscleGroupLabels,
} from "@/lib/training/exercise-options";
import { exerciseVisualByNormalizedName } from "@/lib/training/exercise-catalog";

export const dynamic = "force-dynamic";

type TrainingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const emptyValues: ExerciseFormValues = {
  name: "",
  category: "STRENGTH",
  equipment: "BODYWEIGHT",
  muscleGroups: [],
  notes: "",
};

function queryValue(
  query: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function TrainingPage({ searchParams }: TrainingPageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const editId = queryValue(query, "edit");
  const showArchived = queryValue(query, "view") === "archived";

  const [
    exercises,
    editedExercise,
    activeSession,
    recentSessions,
    settings,
    trainingPlans,
  ] = await Promise.all([
    prisma.exercise.findMany({
      where: {
        userId: user.id,
        archivedAt: showArchived ? { not: null } : null,
      },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    editId
      ? prisma.exercise.findFirst({
          where: { id: editId, userId: user.id, archivedAt: null },
        })
      : null,
    prisma.trainingSession.findFirst({
      where: { userId: user.id, completedAt: null },
      orderBy: { startedAt: "desc" },
      include: {
        trainingPlan: {
          include: {
            exercises: {
              orderBy: { position: "asc" },
              include: { exercise: true },
            },
          },
        },
        sets: {
          orderBy: { createdAt: "asc" },
          include: { exercise: { select: { name: true } } },
        },
      },
    }),
    prisma.trainingSession.findMany({
      where: { userId: user.id, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 3,
      include: { _count: { select: { sets: true } } },
    }),
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true, locale: true },
    }),
    prisma.trainingPlan.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      include: { _count: { select: { exercises: true } } },
    }),
  ]);

  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const locale = settings?.locale ?? defaultLocale;

  const formValues: ExerciseFormValues = editedExercise
    ? {
        id: editedExercise.id,
        name: editedExercise.name,
        category: editedExercise.category,
        equipment: editedExercise.equipment,
        muscleGroups: editedExercise.muscleGroups,
        notes: editedExercise.notes ?? "",
      }
    : emptyValues;

  const error = queryValue(query, "error");
  const errorMessage = (() => {
    switch (error) {
      case "duplicate":
        return "Eine Übung mit diesem Namen ist bereits vorhanden.";
      case "not-found":
        return "Die Übung wurde nicht gefunden oder gehört nicht zu deinem Konto.";
      case "validation":
        return "Bitte prüfe die Angaben. Name, Trainingsart und Gerät sind erforderlich; maximal vier Muskelgruppen sind möglich.";
      case "training-set-validation":
        return "Bitte prüfe Wiederholungen, Gewicht und Anstrengung des Satzes.";
      case "training-not-found":
        return "Die Trainingseinheit oder Übung wurde nicht gefunden.";
      case "training-plan-required":
        return "Bitte wähle einen Trainingsplan mit mindestens einer Übung aus.";
      default:
        return null;
    }
  })();

  const successMessage = queryValue(query, "added")
    ? "Übung zur Bibliothek hinzugefügt."
    : queryValue(query, "exists")
      ? "Diese Übung ist bereits in deiner Bibliothek."
      : queryValue(query, "saved")
        ? "Übung gespeichert."
        : queryValue(query, "archived")
          ? "Übung archiviert."
          : queryValue(query, "restored")
            ? "Übung wiederhergestellt."
            : queryValue(query, "session-started")
              ? "Training gestartet."
              : queryValue(query, "set-added")
                ? "Satz gespeichert."
                : queryValue(query, "set-deleted")
                  ? "Satz entfernt."
                  : queryValue(query, "session-completed")
                    ? "Training abgeschlossen."
            : null;

  const sessionForCard = activeSession
    ? {
        id: activeSession.id,
        planName: activeSession.planName,
        startedAtLabel: timeInTimeZone(activeSession.startedAt, timeZone),
        sets: activeSession.sets.map((set) => ({
          id: set.id,
          exerciseId: set.exerciseId,
          exerciseName: set.exercise.name,
          setNumber: set.setNumber,
          repetitions: set.repetitions,
          weightKg: set.weightKg?.toString() ?? null,
          effort: set.effort,
        })),
      }
    : null;

  const sessionExercises = activeSession?.trainingPlan
    ? activeSession.trainingPlan.exercises
        .map(({ exercise }) => exercise)
        .filter((exercise) => exercise.archivedAt === null)
    : exercises;

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Training</PageTitle>
          <PageSubtitle className="mt-4">
            Erfasse Trainingseinheiten mit wenigen Handgriffen und entwickle
            daraus langfristig deinen persönlichen Fortschritt.
          </PageSubtitle>
        </header>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-8 rounded-[var(--radius-md)] border border-danger bg-surface-raised px-4 py-3 text-sm font-semibold text-danger"
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p
            role="status"
            className="mt-8 rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft px-4 py-3 text-sm font-semibold text-forest-strong"
          >
            {successMessage}
          </p>
        ) : null}

        {!showArchived && !editedExercise ? (
          <Section aria-label="Trainingseinheit erfassen">
            <Card>
              <CardHeader>
                <CardTitle>Trainingseinheit</CardTitle>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Übung wählen, Wiederholungen und Gewicht einstellen, Satz
                  speichern.
                </p>
              </CardHeader>
              <CardContent>
                <TrainingSessionCard
                  exercises={sessionExercises.map((exercise) => ({
                    id: exercise.id,
                    name: exercise.name,
                    visual: exerciseVisualByNormalizedName.get(
                      exercise.normalizedName,
                    ),
                  }))}
                  plans={trainingPlans.map((plan) => ({
                    id: plan.id,
                    name: plan.name,
                    exerciseCount: plan._count.exercises,
                  }))}
                  session={sessionForCard}
                />
              </CardContent>
            </Card>

            {recentSessions.length > 0 ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle>Letzte Einheiten</CardTitle>
                  <Link
                    href="/training/verlauf"
                    className="flex min-h-10 items-center text-sm font-semibold text-forest-strong"
                  >
                    Verlauf öffnen →
                  </Link>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    {recentSessions.map((session) => {
                      const completedAt = session.completedAt ?? session.startedAt;
                      const durationMinutes = Math.max(
                        1,
                        Math.round(
                          (completedAt.getTime() - session.startedAt.getTime()) /
                            60000,
                        ),
                      );

                      return (
                        <li
                          key={session.id}
                          className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] bg-surface-muted px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-text-primary">
                              {session.planName ?? "Training"}
                            </p>
                            <p className="mt-1 text-xs text-text-muted">
                              {new Intl.DateTimeFormat(locale, {
                                timeZone,
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }).format(session.startedAt)}
                              {" · "}
                              {session._count.sets}{" "}
                              {session._count.sets === 1 ? "Satz" : "Sätze"}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-forest-strong">
                            {durationMinutes} Min.
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
          </Section>
        ) : null}

        {!showArchived && !editedExercise ? (
          <Section aria-label="Übung schnell auswählen">
            <Card>
              <CardHeader>
                <CardTitle>Übung auswählen</CardTitle>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Körperbereich wählen, Übung antippen, fertig.
                </p>
              </CardHeader>
              <CardContent>
                <ExerciseQuickAdd
                  existingNames={exercises.map(
                    (exercise) => exercise.normalizedName,
                  )}
                />
              </CardContent>
            </Card>
          </Section>
        ) : null}

        <Section
          aria-label="Übungsbibliothek verwalten"
          className="grid grid-cols-12 gap-5"
        >
          <Card className="col-span-12 xl:col-span-5">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>
                {editedExercise ? "Übung bearbeiten" : "Eigene Übung"}
              </CardTitle>
              {editedExercise ? (
                <Link
                  href="/training"
                  className="text-sm font-semibold text-forest-strong"
                >
                  Abbrechen
                </Link>
              ) : null}
            </CardHeader>
            <CardContent>
              {editedExercise ? (
                <ExerciseForm key={editedExercise.id} values={formValues} />
              ) : (
                <details>
                  <summary className="flex min-h-12 cursor-pointer items-center justify-between rounded-[var(--radius-md)] border border-border-strong px-4 py-3 text-sm font-semibold text-forest-strong">
                    Manuell anlegen
                  </summary>
                  <div className="mt-6">
                    <ExerciseForm key="new-exercise" values={formValues} />
                  </div>
                </details>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-7">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>
                  {showArchived ? "Archivierte Übungen" : "Meine Übungen"}
                </CardTitle>
                <p className="mt-1 text-xs text-text-muted">
                  {exercises.length} {exercises.length === 1 ? "Übung" : "Übungen"}
                </p>
              </div>
              <Link
                href={showArchived ? "/training" : "/training?view=archived"}
                className="min-h-10 rounded-[var(--radius-md)] border border-border-strong px-4 py-2 text-sm font-semibold text-forest-strong"
              >
                {showArchived ? "Aktive zeigen" : "Archiv anzeigen"}
              </Link>
            </CardHeader>

            <CardContent>
              {exercises.length === 0 ? (
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-5">
                  <p className="font-semibold text-text-primary">
                    {showArchived
                      ? "Noch keine Übungen archiviert"
                      : "Deine Bibliothek ist noch leer"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    {showArchived
                      ? "Archivierte Übungen bleiben erhalten und können jederzeit wiederhergestellt werden."
                      : "Lege links deine erste Übung mit Trainingsart, Gerät und Muskelgruppen an."}
                  </p>
                </div>
              ) : (
                <ul className="grid gap-3">
                  {exercises.map((exercise) => (
                    <li
                      key={exercise.id}
                      className="rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary p-4 sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-text-primary">
                            {exercise.name}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-text-muted">
                            {exerciseCategoryLabels[exercise.category]} ·{" "}
                            {exerciseEquipmentLabels[exercise.equipment]}
                          </p>
                        </div>
                        {!showArchived ? (
                          <Link
                            href={`/training?edit=${exercise.id}`}
                            className="text-sm font-semibold text-forest-strong"
                          >
                            Bearbeiten
                          </Link>
                        ) : null}
                      </div>

                      {exercise.muscleGroups.length > 0 ? (
                        <div
                          className="mt-3 flex flex-wrap gap-2"
                          aria-label="Muskelgruppen"
                        >
                          {exercise.muscleGroups.map((muscleGroup) => (
                            <span
                              key={muscleGroup}
                              className="rounded-full bg-forest-soft px-3 py-1 text-xs font-semibold text-forest-strong"
                            >
                              {muscleGroupLabels[muscleGroup]}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {exercise.notes ? (
                        <p className="mt-3 text-sm leading-6 text-text-muted">
                          {exercise.notes}
                        </p>
                      ) : null}

                      <form action={setExerciseArchived} className="mt-4">
                        <input
                          type="hidden"
                          name="exerciseId"
                          value={exercise.id}
                        />
                        <input
                          type="hidden"
                          name="intent"
                          value={showArchived ? "restore" : "archive"}
                        />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-text-muted hover:text-forest-strong"
                        >
                          {showArchived ? "Wiederherstellen" : "Archivieren"}
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
