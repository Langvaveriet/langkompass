import type { ExerciseArea } from "@/lib/training/exercise-catalog";

type MuscleAreaIconProps = {
  area: ExerciseArea;
};

const horizontalPosition: Record<ExerciseArea, string> = {
  ARMS: "0%",
  BACK: "25%",
  CHEST: "50%",
  CORE: "75%",
  LEGS: "100%",
};

export function MuscleAreaIcon({ area }: MuscleAreaIconProps) {
  return (
    <span
      aria-hidden="true"
      className="block h-20 w-12 bg-no-repeat"
      style={{
        backgroundImage: 'url("/training/muscle-areas.webp")',
        backgroundPosition: `${horizontalPosition[area]} center`,
        backgroundSize: "500% 100%",
      }}
    />
  );
}
