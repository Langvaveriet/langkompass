export type ExerciseRecordSummary = {
  exerciseId: string;
  maximumWeightKg: number | null;
  maximumRepetitions: number | null;
  setCount: number;
};

export type ExerciseRecordDetails = {
  id: string;
  name: string;
  normalizedName: string;
};

export type PersonalTrainingRecord = {
  exerciseId: string;
  exerciseName: string;
  normalizedName: string;
  maximumWeightKg: number | null;
  maximumRepetitions: number;
  setCount: number;
};

/**
 * Verknüpft aggregierte Satzwerte mit ihren Übungen und blendet verwaiste oder
 * unvollständige Datensätze aus. Die Sortierung bleibt unabhängig von der DB.
 */
export function buildPersonalTrainingRecords(
  summaries: ExerciseRecordSummary[],
  exercises: ExerciseRecordDetails[],
): PersonalTrainingRecord[] {
  const exerciseById = new Map(
    exercises.map((exercise) => [exercise.id, exercise]),
  );

  return summaries
    .flatMap((summary) => {
      const exercise = exerciseById.get(summary.exerciseId);

      if (!exercise || summary.maximumRepetitions === null) {
        return [];
      }

      return [
        {
          exerciseId: summary.exerciseId,
          exerciseName: exercise.name,
          normalizedName: exercise.normalizedName,
          maximumWeightKg: summary.maximumWeightKg,
          maximumRepetitions: summary.maximumRepetitions,
          setCount: summary.setCount,
        },
      ];
    })
    .sort((left, right) =>
      left.exerciseName.localeCompare(right.exerciseName, "de"),
    );
}
