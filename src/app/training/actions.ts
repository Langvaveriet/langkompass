"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { exercisePresetByKey } from "@/lib/training/exercise-catalog";
import {
  exerciseCategoryValues,
  exerciseEquipmentValues,
  muscleGroupValues,
} from "@/lib/training/exercise-options";

const exerciseSchema = z.object({
  exerciseId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(2).max(80),
  category: z.enum(exerciseCategoryValues),
  equipment: z.enum(exerciseEquipmentValues),
  muscleGroups: z.array(z.enum(muscleGroupValues)).max(4),
  notes: z.string().trim().max(500),
});

const archiveSchema = z.object({
  exerciseId: z.string().trim().min(1),
  intent: z.enum(["archive", "restore"]),
});

const catalogExerciseSchema = z.object({
  exerciseKey: z.string().trim().min(1),
});

const trainingSessionSchema = z.object({
  trainingSessionId: z.string().trim().min(1),
});

const trainingSetSchema = trainingSessionSchema.extend({
  exerciseId: z.string().trim().min(1),
  repetitions: z.coerce.number().int().min(1).max(1000),
  weightKg: z
    .string()
    .trim()
    .transform((value) =>
      value === "" ? null : Number(value.replace(",", ".")),
    )
    .refine(
      (value) => value === null || (Number.isFinite(value) && value >= 0 && value <= 2000),
    ),
  effort: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .refine(
      (value) => value === null || (Number.isInteger(value) && value >= 1 && value <= 10),
    ),
});

const trainingSetIdSchema = z.object({
  trainingSetId: z.string().trim().min(1),
});

function formText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function normalizedExerciseName(name: string): string {
  return name.toLocaleLowerCase("de-DE").replace(/\s+/g, " ");
}

export async function saveExercise(formData: FormData) {
  const user = await requireUser();
  const parsed = exerciseSchema.safeParse({
    exerciseId: formText(formData, "exerciseId") || undefined,
    name: formText(formData, "name"),
    category: formText(formData, "category"),
    equipment: formText(formData, "equipment"),
    muscleGroups: formData
      .getAll("muscleGroups")
      .filter((value): value is string => typeof value === "string"),
    notes: formText(formData, "notes"),
  });

  if (!parsed.success) {
    redirect("/training?error=validation");
  }

  const { exerciseId, name, category, equipment, muscleGroups, notes } =
    parsed.data;
  const normalizedName = normalizedExerciseName(name);
  const duplicate = await prisma.exercise.findFirst({
    where: {
      userId: user.id,
      normalizedName,
      ...(exerciseId ? { id: { not: exerciseId } } : {}),
    },
    select: { id: true },
  });

  if (duplicate) {
    redirect(
      `/training?error=duplicate${exerciseId ? `&edit=${exerciseId}` : ""}`,
    );
  }

  const data = {
    name,
    normalizedName,
    category,
    equipment,
    muscleGroups,
    notes: notes || null,
  };

  if (exerciseId) {
    const existing = await prisma.exercise.findFirst({
      where: { id: exerciseId, userId: user.id },
      select: { id: true },
    });

    if (!existing) {
      redirect("/training?error=not-found");
    }

    await prisma.exercise.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.exercise.create({
      data: { userId: user.id, ...data },
    });
  }

  revalidatePath("/training");
  redirect("/training?saved=1");
}

export async function addCatalogExercise(formData: FormData) {
  const user = await requireUser();
  const parsed = catalogExerciseSchema.safeParse({
    exerciseKey: formText(formData, "exerciseKey"),
  });

  if (!parsed.success) {
    redirect("/training?error=validation");
  }

  const preset = exercisePresetByKey.get(parsed.data.exerciseKey);

  if (!preset) {
    redirect("/training?error=validation");
  }

  const normalizedName = normalizedExerciseName(preset.name);
  const existing = await prisma.exercise.findUnique({
    where: {
      userId_normalizedName: {
        userId: user.id,
        normalizedName,
      },
    },
    select: { id: true, archivedAt: true },
  });

  if (existing && !existing.archivedAt) {
    redirect("/training?exists=1");
  }

  const data = {
    name: preset.name,
    normalizedName,
    category: preset.category,
    equipment: preset.equipment,
    muscleGroups: preset.muscleGroups,
    notes: null,
    archivedAt: null,
  };

  if (existing) {
    await prisma.exercise.update({ where: { id: existing.id }, data });
  } else {
    await prisma.exercise.create({ data: { userId: user.id, ...data } });
  }

  revalidatePath("/training");
  redirect(`/training?${existing ? "restored" : "added"}=1`);
}

export async function setExerciseArchived(formData: FormData) {
  const user = await requireUser();
  const parsed = archiveSchema.safeParse({
    exerciseId: formText(formData, "exerciseId"),
    intent: formText(formData, "intent"),
  });

  if (!parsed.success) {
    redirect("/training?error=validation");
  }

  const exercise = await prisma.exercise.findFirst({
    where: { id: parsed.data.exerciseId, userId: user.id },
    select: { id: true },
  });

  if (!exercise) {
    redirect("/training?error=not-found");
  }

  const restoring = parsed.data.intent === "restore";
  await prisma.exercise.update({
    where: { id: exercise.id },
    data: { archivedAt: restoring ? null : new Date() },
  });

  revalidatePath("/training");
  redirect(`/training?${restoring ? "restored" : "archived"}=1`);
}

export async function startTrainingSession() {
  const user = await requireUser();
  const activeSession = await prisma.trainingSession.findFirst({
    where: { userId: user.id, completedAt: null },
    orderBy: { startedAt: "desc" },
    select: { id: true },
  });

  if (activeSession) {
    redirect(`/training?session=${activeSession.id}`);
  }

  const session = await prisma.trainingSession.create({
    data: { userId: user.id },
    select: { id: true },
  });

  revalidatePath("/training");
  redirect(`/training?session=${session.id}&session-started=1`);
}

export async function addTrainingSet(formData: FormData) {
  const user = await requireUser();
  const parsed = trainingSetSchema.safeParse({
    trainingSessionId: formText(formData, "trainingSessionId"),
    exerciseId: formText(formData, "exerciseId"),
    repetitions: formText(formData, "repetitions"),
    weightKg: formText(formData, "weightKg"),
    effort: formText(formData, "effort"),
  });

  if (!parsed.success) {
    redirect("/training?error=training-set-validation");
  }

  const { trainingSessionId, exerciseId, repetitions, weightKg, effort } =
    parsed.data;
  const [session, exercise, latestSet] = await Promise.all([
    prisma.trainingSession.findFirst({
      where: { id: trainingSessionId, userId: user.id, completedAt: null },
      select: { id: true },
    }),
    prisma.exercise.findFirst({
      where: { id: exerciseId, userId: user.id, archivedAt: null },
      select: { id: true },
    }),
    prisma.trainingSet.aggregate({
      where: { trainingSessionId, exerciseId, userId: user.id },
      _max: { setNumber: true },
    }),
  ]);

  if (!session || !exercise) {
    redirect("/training?error=training-not-found");
  }

  await prisma.trainingSet.create({
    data: {
      userId: user.id,
      trainingSessionId: session.id,
      exerciseId: exercise.id,
      setNumber: (latestSet._max.setNumber ?? 0) + 1,
      repetitions,
      weightKg,
      effort,
    },
  });

  revalidatePath("/training");
  redirect(`/training?session=${session.id}&set-added=1`);
}

export async function deleteTrainingSet(formData: FormData) {
  const user = await requireUser();
  const parsed = trainingSetIdSchema.safeParse({
    trainingSetId: formText(formData, "trainingSetId"),
  });

  if (!parsed.success) {
    redirect("/training?error=validation");
  }

  const trainingSet = await prisma.trainingSet.findFirst({
    where: {
      id: parsed.data.trainingSetId,
      userId: user.id,
      trainingSession: { completedAt: null },
    },
    select: { id: true, trainingSessionId: true },
  });

  if (!trainingSet) {
    redirect("/training?error=training-not-found");
  }

  await prisma.trainingSet.delete({ where: { id: trainingSet.id } });

  revalidatePath("/training");
  redirect(`/training?session=${trainingSet.trainingSessionId}&set-deleted=1`);
}

export async function completeTrainingSession(formData: FormData) {
  const user = await requireUser();
  const parsed = trainingSessionSchema.safeParse({
    trainingSessionId: formText(formData, "trainingSessionId"),
  });

  if (!parsed.success) {
    redirect("/training?error=validation");
  }

  const session = await prisma.trainingSession.findFirst({
    where: {
      id: parsed.data.trainingSessionId,
      userId: user.id,
      completedAt: null,
    },
    select: { id: true },
  });

  if (!session) {
    redirect("/training?error=training-not-found");
  }

  await prisma.trainingSession.update({
    where: { id: session.id },
    data: { completedAt: new Date() },
  });

  revalidatePath("/training");
  redirect("/training?session-completed=1");
}
