export const postMealSymptomOptions = [
  { value: "stomach", label: "Magenbeschwerden", emoji: "🫃" },
  { value: "digestion", label: "Verdauung", emoji: "🫧" },
  { value: "nausea", label: "Übelkeit", emoji: "🤢" },
  { value: "headache", label: "Kopfschmerzen", emoji: "🤕" },
  { value: "fatigue", label: "Müdigkeit", emoji: "🥱" },
  { value: "dizziness", label: "Schwindel", emoji: "💫" },
  { value: "skin", label: "Hautreaktion", emoji: "🖐️" },
  { value: "swelling", label: "Schwellung", emoji: "🔴" },
  { value: "breathing", label: "Atemwege", emoji: "🫁" },
] as const;

export const reactionDelayOptions = [
  { value: 0, label: "Direkt" },
  { value: 30, label: "Nach 30 Min." },
  { value: 60, label: "Nach 1 Std." },
  { value: 120, label: "Nach 2 Std." },
  { value: 240, label: "Nach 4 Std." },
] as const;

export const postMealSymptomLabels = new Map<string, string>(
  postMealSymptomOptions.map((option) => [option.value, option.label]),
);

export const reactionDelayLabels = new Map<number, string>(
  reactionDelayOptions.map((option) => [option.value, option.label]),
);

export const allowedPostMealSymptoms = new Set<string>(
  postMealSymptomOptions.map((option) => option.value),
);

export const allowedReactionDelays = new Set<number>(
  reactionDelayOptions.map((option) => option.value),
);
