import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type TodayMealPlanItem = {
  id: string;
  mealType: string;
  recipeName: string;
  completed: boolean;
};

type TodayMealPlanProps = {
  date: string;
  completedCount: number;
  items: readonly TodayMealPlanItem[];
};

const linkBase =
  "inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] px-5 py-3 text-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-2";

export function TodayMealPlan({
  date,
  completedCount,
  items,
}: TodayMealPlanProps) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Heute geplant
          </p>
          <CardTitle className="mt-1">Mahlzeitenplan</CardTitle>
        </div>

        <span className="shrink-0 rounded-full bg-forest-soft px-3 py-1.5 text-sm font-semibold text-forest-strong">
          {completedCount} / {items.length} erfasst
        </span>
      </CardHeader>

      <CardContent className="grid min-w-0 gap-5">
        <div className="flex max-w-full gap-3 overflow-x-auto pb-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-44 flex-1 rounded-[var(--radius-md)] border border-border-subtle bg-surface-muted p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold text-text-muted">
                  {item.mealType}
                </p>
                <span
                  className={[
                    "h-3 w-3 shrink-0 rounded-full",
                    item.completed ? "bg-forest-strong" : "bg-border-strong",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-text-primary">
                {item.recipeName}
              </p>
              <p
                className={[
                  "mt-3 text-xs font-semibold",
                  item.completed ? "text-forest-strong" : "text-text-muted",
                ].join(" ")}
              >
                {item.completed ? "Erfasst" : "Noch offen"}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/ernaehrung/wochenplan?date=${date}`}
            className={`${linkBase} bg-forest-strong text-surface hover:opacity-90`}
          >
            Wochenplan öffnen
          </Link>
          <Link
            href={`/ernaehrung?date=${date}`}
            className={`${linkBase} border border-border-strong bg-surface-raised text-text-primary hover:bg-surface-muted`}
          >
            Ernährung öffnen
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
