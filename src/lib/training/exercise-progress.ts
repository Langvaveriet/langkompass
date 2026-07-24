export type ExerciseProgressSession = {
  id: string;
  completedAt: Date;
  sets: Array<{
    repetitions: number;
    weightKg: number | null;
  }>;
};

export type ExerciseProgressMetric = "weight" | "repetitions";

export type ExerciseProgressPoint = {
  sessionId: string;
  completedAt: Date;
  value: number;
};

export type ExerciseProgress = {
  metric: ExerciseProgressMetric;
  points: ExerciseProgressPoint[];
};

/**
 * Ermittelt pro Einheit den höchsten vergleichbaren Satzwert. Sobald echte
 * Gewichte vorliegen, werden Einheiten ohne Gewicht aus dem kg-Verlauf
 * ausgeschlossen; Körpergewichtsübungen verwenden stattdessen Wiederholungen.
 */
export function buildExerciseProgress(
  sessions: ExerciseProgressSession[],
): ExerciseProgress {
  const metric: ExerciseProgressMetric = sessions.some((session) =>
    session.sets.some((set) => set.weightKg !== null),
  )
    ? "weight"
    : "repetitions";

  const points = sessions
    .flatMap((session) => {
      const values = session.sets.flatMap((set) => {
        if (metric === "weight") {
          return set.weightKg === null ? [] : [set.weightKg];
        }

        return [set.repetitions];
      });

      if (values.length === 0) {
        return [];
      }

      return [
        {
          sessionId: session.id,
          completedAt: session.completedAt,
          value: Math.max(...values),
        },
      ];
    })
    .sort((left, right) =>
      left.completedAt.getTime() - right.completedAt.getTime(),
    );

  return { metric, points };
}
