import type { ExerciseVisual } from "@/lib/training/exercise-catalog";

type ExerciseThumbnailProps = {
  name: string;
  visual?: ExerciseVisual;
  size?: "sm" | "lg";
};

export function ExerciseThumbnail({
  name,
  visual,
  size = "sm",
}: ExerciseThumbnailProps) {
  const sizeClass = size === "lg" ? "h-24 w-24" : "h-12 w-12";

  if (!visual) {
    return (
      <span
        aria-hidden="true"
        className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-forest-soft text-sm font-semibold text-forest-strong`}
      >
        {name.slice(0, 1).toLocaleUpperCase("de-DE")}
      </span>
    );
  }

  const spriteCrop =
    visual.catalog === "extended"
      ? visual.row === 3
        ? "inset(5% 5% 14%)"
        : "inset(5%)"
      : visual.row === 0
        ? "inset(0 6% 4%)"
        : visual.row === 4
          ? "inset(12% 6% 2%)"
          : "inset(20% 6% 4%)";

  return (
    <span
      aria-hidden="true"
      className={`block ${sizeClass} shrink-0 bg-no-repeat`}
      style={{
        backgroundImage: `url("/training/exercise-catalog-${visual.catalog === "base" ? "v2" : "extended"}.webp")`,
        backgroundPosition: `${visual.column * 25}% ${visual.row * 25}%`,
        backgroundSize: "500% 500%",
        clipPath: spriteCrop,
      }}
    />
  );
}
