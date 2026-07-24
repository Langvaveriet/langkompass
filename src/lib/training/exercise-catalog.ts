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
      {
        key: "concentration-curl",
        name: "Konzentrationscurl",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["ARMS"],
      },
      {
        key: "preacher-curl",
        name: "Scott-Curl",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["ARMS"],
      },
      {
        key: "overhead-triceps-extension",
        name: "Trizepsstrecken über Kopf",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["ARMS"],
      },
      {
        key: "barbell-skull-crusher",
        name: "French Press",
        category: "STRENGTH",
        equipment: "BARBELL",
        muscleGroups: ["ARMS"],
      },
      {
        key: "close-grip-bench-press",
        name: "Enges Bankdrücken",
        category: "STRENGTH",
        equipment: "BARBELL",
        muscleGroups: ["ARMS", "CHEST"],
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
      {
        key: "barbell-deadlift",
        name: "Kreuzheben",
        category: "STRENGTH",
        equipment: "BARBELL",
        muscleGroups: ["BACK", "LEGS", "GLUTES", "CORE"],
      },
      {
        key: "bent-over-barbell-row",
        name: "Langhantelrudern",
        category: "STRENGTH",
        equipment: "BARBELL",
        muscleGroups: ["BACK", "ARMS"],
      },
      {
        key: "cable-face-pull",
        name: "Face Pull",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["BACK", "SHOULDERS"],
      },
      {
        key: "reverse-fly-machine",
        name: "Reverse Butterfly",
        category: "STRENGTH",
        equipment: "MACHINE",
        muscleGroups: ["BACK", "SHOULDERS"],
      },
      {
        key: "straight-arm-pulldown",
        name: "Überzug am Kabelzug",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["BACK", "ARMS"],
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
      {
        key: "incline-dumbbell-press",
        name: "Schrägbankdrücken",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["CHEST", "ARMS", "SHOULDERS"],
      },
      {
        key: "standing-cable-fly",
        name: "Cable Fly",
        category: "STRENGTH",
        equipment: "CABLE",
        muscleGroups: ["CHEST"],
      },
      {
        key: "incline-chest-press-machine",
        name: "Schrägbank-Brustpresse",
        category: "STRENGTH",
        equipment: "MACHINE",
        muscleGroups: ["CHEST", "ARMS", "SHOULDERS"],
      },
      {
        key: "dumbbell-pullover",
        name: "Kurzhantel-Pullover",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["CHEST", "BACK"],
      },
      {
        key: "decline-push-up",
        name: "Liegestütz erhöht",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CHEST", "ARMS", "CORE"],
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
      {
        key: "dead-bug",
        name: "Dead Bug",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE"],
      },
      {
        key: "russian-twist",
        name: "Russian Twist",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["CORE"],
      },
      {
        key: "mountain-climber",
        name: "Mountain Climber",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE", "LEGS", "SHOULDERS"],
      },
      {
        key: "bicycle-crunch",
        name: "Fahrrad-Crunch",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE"],
      },
      {
        key: "hanging-knee-raise",
        name: "Hängendes Knieheben",
        category: "STRENGTH",
        equipment: "BODYWEIGHT",
        muscleGroups: ["CORE", "ARMS"],
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
      {
        key: "romanian-deadlift",
        name: "Rumänisches Kreuzheben",
        category: "STRENGTH",
        equipment: "BARBELL",
        muscleGroups: ["LEGS", "GLUTES", "BACK"],
      },
      {
        key: "barbell-hip-thrust",
        name: "Hip Thrust",
        category: "STRENGTH",
        equipment: "BARBELL",
        muscleGroups: ["GLUTES", "LEGS"],
      },
      {
        key: "leg-extension",
        name: "Beinstrecker",
        category: "STRENGTH",
        equipment: "MACHINE",
        muscleGroups: ["LEGS"],
      },
      {
        key: "bulgarian-split-squat",
        name: "Bulgarische Kniebeuge",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["LEGS", "GLUTES", "CORE"],
      },
      {
        key: "goblet-squat",
        name: "Goblet Squat",
        category: "STRENGTH",
        equipment: "DUMBBELL",
        muscleGroups: ["LEGS", "GLUTES", "CORE"],
      },
    ],
  },
];

export const exercisePresetByKey = new Map(
  exerciseCatalog.flatMap((area) =>
    area.exercises.map((exercise) => [exercise.key, exercise] as const),
  ),
);
