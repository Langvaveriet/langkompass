import Link from "next/link";

import { archiveTrainingPlan } from "@/app/training/actions";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { Section } from "@/components/layout/section";
import { ExerciseThumbnail } from "@/components/training/exercise-thumbnail";
import {
  TrainingPlanForm,
  type TrainingPlanFormValues,
} from "@/components/training/training-plan-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { exerciseVisualByNormalizedName } from "@/lib/training/exercise-catalog";

export const dynamic = "force-dynamic";

type TrainingPlansPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryValue(
  query: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function TrainingPlansPage({
  searchParams,
}: TrainingPlansPageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const editId = queryValue(query, "edit");

  const [exercises, plans] = await Promise.all([
    prisma.exercise.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, normalizedName: true },
    }),
    prisma.trainingPlan.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      include: {
        exercises: {
          orderBy: { position: "asc" },
          include: {
            exercise: {
              select: { id: true, name: true, normalizedName: true },
            },
          },
        },
      },
    }),
  ]);

  const editedPlan = editId
    ? plans.find((plan) => plan.id === editId) ?? null
    : null;
  const formValues: TrainingPlanFormValues = editedPlan
    ? {
        id: editedPlan.id,
        name: editedPlan.name,
        exercises: editedPlan.exercises.map(
          ({ exerciseId, targetSets, targetReps }) => ({
            exerciseId,
            targetSets,
            targetReps,
          }),
        ),
      }
    : { name: "", exercises: [] };
  const error = queryValue(query, "error");
  const errorMessage =
    error === "duplicate"
      ? "Ein Trainingsplan mit diesem Namen ist bereits vorhanden."
      : error === "not-found"
        ? "Der Trainingsplan wurde nicht gefunden."
        : error === "exercise-not-found"
          ? "Mindestens eine ausgewählte Übung ist nicht mehr verfügbar."
          : error === "targets"
            ? "Bitte prüfe Satzanzahl und Wiederholungsziel der ausgewählten Übungen."
            : error === "validation"
              ? "Bitte gib einen Namen ein und wähle mindestens eine Übung aus."
              : editId && !editedPlan
                ? "Der Trainingsplan wurde nicht gefunden."
                : null;

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
          <PageTitle className="mt-4">Trainingspläne</PageTitle>
          <PageSubtitle className="mt-4">
            Stelle unterschiedliche Einheiten einmal zusammen und starte sie
            später mit einem Fingertipp.
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

        {queryValue(query, "saved") ? (
          <p
            role="status"
            className="mt-8 rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft px-4 py-3 text-sm font-semibold text-forest-strong"
          >
            Trainingsplan gespeichert.
          </p>
        ) : queryValue(query, "archived") ? (
          <p
            role="status"
            className="mt-8 rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft px-4 py-3 text-sm font-semibold text-forest-strong"
          >
            Trainingsplan archiviert.
          </p>
        ) : null}

        <Section
          aria-label="Trainingspläne verwalten"
          className="grid grid-cols-12 gap-5"
        >
          <Card className="col-span-12 xl:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>
                {editedPlan ? "Trainingsplan bearbeiten" : "Neuer Trainingsplan"}
              </CardTitle>
              {editedPlan ? (
                <Link
                  href="/training/plaene"
                  className="text-sm font-semibold text-forest-strong"
                >
                  Abbrechen
                </Link>
              ) : null}
            </CardHeader>
            <CardContent>
              <TrainingPlanForm
                key={editedPlan?.id ?? "new-plan"}
                exercises={exercises.map((exercise) => ({
                  id: exercise.id,
                  name: exercise.name,
                  visual: exerciseVisualByNormalizedName.get(
                    exercise.normalizedName,
                  ),
                }))}
                values={formValues}
              />
              {exercises.length === 0 ? (
                <Link
                  href="/training"
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-forest-strong"
                >
                  Übungen hinzufügen →
                </Link>
              ) : null}
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-5">
            <CardHeader>
              <CardTitle>Meine Pläne</CardTitle>
              <p className="mt-1 text-xs text-text-muted">
                {plans.length} {plans.length === 1 ? "Plan" : "Pläne"}
              </p>
            </CardHeader>
            <CardContent>
              {plans.length === 0 ? (
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-5">
                  <p className="font-semibold text-text-primary">
                    Noch kein Trainingsplan
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    Wähle links deine Übungen aus und gib dem Training einen
                    kurzen Namen.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-3">
                  {plans.map((plan) => (
                    <li
                      key={plan.id}
                      className="rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-text-primary">
                            {plan.name}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            {plan.exercises.length}{" "}
                            {plan.exercises.length === 1 ? "Übung" : "Übungen"}
                          </p>
                        </div>
                        <Link
                          href={`/training/plaene?edit=${plan.id}`}
                          className="flex min-h-10 items-center text-sm font-semibold text-forest-strong"
                        >
                          Bearbeiten
                        </Link>
                      </div>

                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {plan.exercises.map(
                          ({ exercise, targetSets, targetReps }) => (
                            <div
                              key={exercise.id}
                              className="flex min-w-32 shrink-0 items-center gap-2 rounded-full bg-surface-muted py-1.5 pl-1.5 pr-3"
                            >
                              <ExerciseThumbnail
                                name={exercise.name}
                                visual={exerciseVisualByNormalizedName.get(
                                  exercise.normalizedName,
                                )}
                              />
                              <span>
                                <span className="block text-xs font-semibold text-text-primary">
                                  {exercise.name}
                                </span>
                                <span className="mt-0.5 block text-xs text-text-muted">
                                  {targetSets} × {targetReps}
                                </span>
                              </span>
                            </div>
                          ),
                        )}
                      </div>

                      <form action={archiveTrainingPlan} className="mt-3">
                        <input
                          type="hidden"
                          name="trainingPlanId"
                          value={plan.id}
                        />
                        <Button type="submit" variant="ghost" size="sm">
                          Archivieren
                        </Button>
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
