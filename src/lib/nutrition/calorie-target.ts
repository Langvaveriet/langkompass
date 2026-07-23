import type {
  ActivityLevel,
  CalorieFormulaSex,
  WeightGoal,
} from "@/generated/prisma/enums";

type CalorieTargetProfile = {
  dateOfBirth: Date | null;
  heightCm: number | null;
  weightKg: unknown;
  calorieFormulaSex: CalorieFormulaSex | null;
  activityLevel: ActivityLevel | null;
  weightGoal: WeightGoal | null;
  manualDailyCalorieTarget: number | null;
};

const activityFactors: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  HIGH: 1.725,
  VERY_HIGH: 1.9,
};

const goalAdjustments: Record<WeightGoal, number> = {
  LOSE: -300,
  MAINTAIN: 0,
  GAIN: 300,
};

function ageOnDate(dateOfBirth: Date, referenceDate: Date): number {
  let age = referenceDate.getUTCFullYear() - dateOfBirth.getUTCFullYear();
  const birthdayNotReached =
    referenceDate.getUTCMonth() < dateOfBirth.getUTCMonth() ||
    (referenceDate.getUTCMonth() === dateOfBirth.getUTCMonth() &&
      referenceDate.getUTCDate() < dateOfBirth.getUTCDate());

  if (birthdayNotReached) age -= 1;
  return age;
}

export function calculateDailyCalorieTarget(
  profile: CalorieTargetProfile | null | undefined,
  referenceDate = new Date(),
): number | null {
  if (!profile) return null;
  if (profile.manualDailyCalorieTarget) return profile.manualDailyCalorieTarget;
  if (
    !profile.dateOfBirth ||
    !profile.heightCm ||
    !profile.weightKg ||
    !profile.calorieFormulaSex ||
    !profile.activityLevel ||
    !profile.weightGoal
  ) {
    return null;
  }

  const age = ageOnDate(profile.dateOfBirth, referenceDate);
  if (age < 18 || age > 100) return null;

  const weightKg = Number(profile.weightKg);
  const sexAdjustment = profile.calorieFormulaSex === "MALE" ? 5 : -161;
  const restingEnergy =
    10 * weightKg + 6.25 * profile.heightCm - 5 * age + sexAdjustment;
  const estimatedTarget =
    restingEnergy * activityFactors[profile.activityLevel] +
    goalAdjustments[profile.weightGoal];

  return Math.round(estimatedTarget / 50) * 50;
}
