import type {
  ExerciseCategory,
  ExerciseEquipment,
  MuscleGroup,
} from "@/generated/prisma/enums";

export const exerciseAreaValues = [
  "ARMS",
  "BACK",
  "CHEST",
  "CORE",
  "LEGS",
] as const;

export type ExerciseArea = (typeof exerciseAreaValues)[number];

export type ExercisePreset = {
  key: string;
  name: string;
  category: ExerciseCategory;
  equipment: ExerciseEquipment;
  muscleGroups: MuscleGroup[];
};

export type ExerciseAreaOption = {
  value: ExerciseArea;
  label: string;
  description: string;
  exercises: ExercisePreset[];
};

export const exerciseCatalog: ExerciseAreaOption[] = [
  {
    value: "ARMS",
    label: "Arme",
    description: "Bizeps und Trizeps",
    exercises: [
      {
        key: "dumbbell-curl",
        name: "Bizepscurls",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["ARMS"],
      },
      {
        key: "hammer-curl",
        name: "Hammercurls",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["ARMS"],
      },
      {
        key: "cable-triceps-pushdown",
        name: "Trizepsdrücken",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["ARMS"],
      },
      {
        key: "dips",
        name: "Dips",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["ARMS", "CHEST"],
      },
      {
        key: "cable-curl",
        name: "Armbeugen am Kabelzug",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["ARMS"],
      },
    ],
  },
  {
    value: "BACK",
    label: "Rücken",
    description: "Oberer und unterer Rücken",
    exercises: [
      {
        key: "lat-pulldown",
        name: "Latzug",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["BACK", "ARMS"],
      },
      {
        key: "seated-cable-row",
        name: "Rudern am Kabelzug",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["BACK", "ARMS"],
      },
      {
        key: "one-arm-dumbbell-row",
        name: "Kurzhantelrudern",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["BACK", "ARMS"],
      },
      {
        key: "pull-up",
        name: "Klimmzug",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["BACK", "ARMS"],
      },
      {
        key: "back-extension",
        name: "Rückenstrecker",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["BACK", "CORE"],
      },
    ],
  },
  {
    value: "CHEST",
    label: "Brust",
    description: "Brust und vordere Schulter",
    exercises: [
      {
        key: "chest-press",
        name: "Brustpresse",
        category: "STRENGTH",
        equipment: "MACHINE",
        muscleGroups: ["CHEST", "ARMS"],
      },
      {
        key: "barbell-bench-press",
        name: "Bankdrücken",
        category: "STRENGTH",
        equipment: "BARBELL",
        muscleGroups: ["CHEST", "ARMS"],
      },
      {
        key: "dumbbell-bench-press",
        name: "Kurzhantel-Bankdrücken",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["CHEST", "ARMS"],
      },
      {
        key: "push-up",
        name: "Liegestütz",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CHEST", "ARMS", "CORE"],
      },
      {
        key: "chest-fly-machine",
        name: "Butterfly",
        category: "STRENGTH",
        equipment: "MACHINE",
        muscleGroups: ["CHEST"],
      },
    ],
  },
  {
    value: "CORE",
    label: "Bauch",
    description: "Bauch und Rumpfstabilität",
    exercises: [
      {
        key: "plank",
        name: "Unterarmstütz",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE"],
      },
      {
        key: "crunch",
        name: "Crunches",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE"],
      },
      {
        key: "leg-raise",
        name: "Beinheben",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE"],
      },
      {
        key: "side-plank",
        name: "Seitstütz",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE"],
      },
      {
        key: "pallof-press",
        name: "Pallof Press",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["CORE"],
      },
    ],
  },
  {
    value: "LEGS",
    label: "Beine",
    description: "Oberschenkel, Gesäß und Waden",
    exercises: [
      {
        key: "leg-press",
        name: "Beinpresse",
        category: "STRENGTH",
        equipment: "MACHINE",
        muscleGroups: ["LEGS", "GLUTES"],
      },
      {
        key: "squat",
        name: "Kniebeuge",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["LEGS", "GLUTES", "CORE"],
      },
      {
        key: "lunge",
        name: "Ausfallschritt",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["LEGS", "GLUTES"],
      },
      {
        key: "leg-curl",
        name: "Beinbeuger",
        category: "STRENGTH",
        equipment: "MACHINE",
        muscleGroups: ["LEGS"],
      },
      {
        key: "calf-raise",
        name: "Wadenheben",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["LEGS"],
      },
    ],
  },
];

export const exercisePresetByKey = new Map(
  exerciseCatalog.flatMap((area) =>
    area.exercises.map((exercise) => [exercise.key, exercise] as const),
  ),
);
