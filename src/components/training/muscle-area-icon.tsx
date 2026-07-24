import type { ExerciseArea } from "@/lib/training/exercise-catalog";

type MuscleAreaIconProps = {
  area: ExerciseArea;
};

export function MuscleAreaIcon({ area }: MuscleAreaIconProps) {
  return (
    <svg
      viewBox="0 0 72 92"
      aria-hidden="true"
      className="h-16 w-12"
      fill="none"
    >
      <circle cx="36" cy="10" r="7" fill="currentColor" opacity="0.32" />
      <path
        d="M26 22c3-2 6-3 10-3s7 1 10 3l6 25-7 14H27l-7-14 6-25Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="m26 25-12 19m32-19 12 19M30 59l-5 27m17-27 5 27"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.32"
      />

      {area === "ARMS" ? (
        <path
          d="m25 27-11 17m33-17 11 17"
          stroke="var(--copper)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      ) : null}
      {area === "BACK" ? (
        <path
          d="M27 25c5 4 13 4 18 0l4 20-7 9H30l-7-9 4-20Z"
          fill="var(--copper)"
        />
      ) : null}
      {area === "CHEST" ? (
        <>
          <path d="M27 27h8v12h-10l2-12Z" fill="var(--copper)" />
          <path d="M37 27h8l2 12H37V27Z" fill="var(--copper)" />
        </>
      ) : null}
      {area === "CORE" ? (
        <path
          d="M29 41h14l3 14H26l3-14Z"
          fill="var(--copper)"
        />
      ) : null}
      {area === "LEGS" ? (
        <path
          d="M31 60 26 86m15-26 5 26"
          stroke="var(--copper)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}
