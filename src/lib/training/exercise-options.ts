import type {
  ExerciseCategory,
  ExerciseEquipment,
  MuscleGroup,
} from "@/generated/prisma/enums";

export const exerciseCategoryValues = [
  "STRENGTH",
  "MOBILITY",
  "CARDIO",
  "BALANCE",
] as const satisfies readonly ExerciseCategory[];

export const exerciseEquipmentValues = [
  "BODYWEIGHT",
  "DUMBBELL",
  "BARBELL",
  "KETTLEBELL",
  "MACHINE",
  "CABLE",
  "RESISTANCE_BAND",
  "CARDIO_MACHINE",
  "OTHER",
] as const satisfies readonly ExerciseEquipment[];

export const muscleGroupValues = [
  "CHEST",
  "BACK",
  "SHOULDERS",
  "ARMS",
  "CORE",
  "GLUTES",
  "LEGS",
  "FULL_BODY",
] as const satisfies readonly MuscleGroup[];

export const exerciseCategoryLabels: Record<ExerciseCategory, string> = {
  STRENGTH: "Kraft",
  MOBILITY: "Beweglichkeit",
  CARDIO: "Ausdauer",
  BALANCE: "Balance",
};

export const exerciseEquipmentLabels: Record<ExerciseEquipment, string> = {
  BODYWEIGHT: "Körpergewicht",
  DUMBBELL: "Kurzhantel",
  BARBELL: "Langhantel",
  KETTLEBELL: "Kettlebell",
  MACHINE: "Gerät",
  CABLE: "Kabelzug",
  RESISTANCE_BAND: "Widerstandsband",
  CARDIO_MACHINE: "Cardiogerät",
  OTHER: "Sonstiges",
};

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  CHEST: "Brust",
  BACK: "Rücken",
  SHOULDERS: "Schultern",
  ARMS: "Arme",
  CORE: "Rumpf",
  GLUTES: "Gesäß",
  LEGS: "Beine",
  FULL_BODY: "Ganzkörper",
};
