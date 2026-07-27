import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { CheckInSummary } from "@/lib/dashboard/check-in-summary";

function formatAverage(value: number | null, suffix = ""): string {
  return value === null ? "–" : `${value.toFixed(1).replace(".", ",")}${suffix}`;
}

function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border-subtle bg-surface-muted/70 px-4 py-3.5">
      <dt className="text-xs font-medium text-text-muted">{label}</dt>
      <dd className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-text-primary">
        {value}
      </dd>
    </div>
  );
}

export function SevenDaySummaryCard({ summary }: { summary: CheckInSummary }) {
  return (
    <Card className="h-full overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">
            Verlauf
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-text-primary">
            Letzte 7 Tage
          </h2>
        </div>
        <span className="rounded-full bg-forest-soft px-3 py-1.5 text-sm font-semibold text-forest-strong">
          {summary.recordedDays} / 7 erfasst
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <dl className="grid grid-cols-2 gap-3">
          <SummaryMetric
            label="Ø Schlaf"
            value={formatAverage(summary.averageSleepHours, " Std.")}
          />
          <SummaryMetric
            label="Ø Energie"
            value={formatAverage(summary.averageEnergy, " / 10")}
          />
          <SummaryMetric
            label="Ø Schritte"
            value={
              summary.averageSteps === null
                ? "–"
                : Math.round(summary.averageSteps).toLocaleString("de-DE")
            }
          />
          <SummaryMetric
            label="Ø aktive Zeit"
            value={formatAverage(summary.averageActiveMinutes, " Min.")}
          />
        </dl>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border-subtle pt-5 text-sm">
          <div>
            <dt className="text-xs text-text-muted">Abgeschlossen</dt>
            <dd className="mt-1 font-semibold text-text-primary">
              {summary.completedDays} Tage
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Ø Wohlbefinden</dt>
            <dd className="mt-1 font-semibold text-text-primary">
              {formatAverage(summary.averageWellbeing, " / 10")}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Ø Trinkmenge</dt>
            <dd className="mt-1 font-semibold text-text-primary">
              {formatAverage(summary.averageWaterLiters, " l")}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}

export function NutritionSummaryCard({
  mealCount,
  energyKcal,
  calorieTarget,
  plannedCount,
  completedPlannedCount,
}: {
  mealCount: number;
  energyKcal: number;
  calorieTarget: number | null;
  plannedCount: number;
  completedPlannedCount: number;
}) {
  const percentage = calorieTarget
    ? Math.round((energyKcal / calorieTarget) * 100)
    : null;
  const progressWidth = Math.min(percentage ?? 0, 100);
  const targetDifference = calorieTarget === null
    ? null
    : calorieTarget - energyKcal;

  return (
    <Link
      href="/ernaehrung"
      className="group block rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-4"
    >
      <Card className="h-full overflow-hidden transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">
                Heute
              </p>
              <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-text-primary">
                Ernährung
              </h2>
            </div>
            <span className="text-sm font-semibold text-forest-strong">
              Öffnen →
            </span>
          </div>

          <div className="mt-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-[-0.04em] text-text-primary sm:text-4xl">
                {energyKcal.toLocaleString("de-DE")} kcal
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {calorieTarget
                  ? `von ca. ${calorieTarget.toLocaleString("de-DE")} kcal`
                  : "Persönliches Tagesziel noch unvollständig"}
              </p>
            </div>
            {percentage !== null ? (
              <span className="text-2xl font-semibold text-forest-strong">
                {percentage} %
              </span>
            ) : null}
          </div>

          {calorieTarget ? (
            <div className="mt-5">
              <div
                className="h-2 overflow-hidden rounded-full bg-surface-muted"
                role="progressbar"
                aria-label="Kalorienfortschritt heute"
                aria-valuemin={0}
                aria-valuemax={calorieTarget}
                aria-valuenow={Math.min(energyKcal, calorieTarget)}
              >
                <div
                  className="h-full rounded-full bg-forest-strong transition-[width]"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {targetDifference !== null && targetDifference >= 0
                  ? `Noch ca. ${targetDifference.toLocaleString("de-DE")} kcal bis zum persönlichen Näherungswert.`
                  : `Ca. ${Math.abs(targetDifference ?? 0).toLocaleString("de-DE")} kcal über dem persönlichen Näherungswert.`}
              </p>
            </div>
          ) : null}

          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border-subtle pt-5">
            <div>
              <dt className="text-xs text-text-muted">Erfasste Mahlzeiten</dt>
              <dd className="mt-1 font-semibold text-text-primary">
                {mealCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Tagesplan</dt>
              <dd className="mt-1 font-semibold text-text-primary">
                {plannedCount > 0
                  ? `${completedPlannedCount} / ${plannedCount} erledigt`
                  : "Nicht geplant"}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </Link>
  );
}

export function SupplementSummaryCard({
  activeCount,
  todayIntakeCount,
  todaySupplementCount,
  sevenDayIntakeCount,
}: {
  activeCount: number;
  todayIntakeCount: number;
  todaySupplementCount: number;
  sevenDayIntakeCount: number;
}) {
  return (
    <Link
      href="/supplemente"
      className="group block rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-4"
    >
      <Card className="h-full overflow-hidden transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">
                Dokumentation
              </p>
              <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-text-primary">
                Supplemente
              </h2>
            </div>
            <span className="text-sm font-semibold text-forest-strong">
              Öffnen →
            </span>
          </div>

          <div className="mt-7">
            <p className="text-3xl font-semibold tracking-[-0.04em] text-text-primary sm:text-4xl">
              {todayIntakeCount} {todayIntakeCount === 1 ? "Einnahme" : "Einnahmen"}
            </p>
            <p className="mt-1 text-sm text-text-muted">heute dokumentiert</p>
          </div>

          <div className="mt-6 rounded-[var(--radius-md)] bg-forest-soft px-4 py-3.5">
            <p className="text-sm font-semibold text-forest-strong">
              {todaySupplementCount > 0
                ? `${todaySupplementCount} ${todaySupplementCount === 1 ? "Präparat" : "Präparate"} heute erfasst`
                : activeCount > 0
                  ? "Heute noch keine Einnahme erfasst"
                  : "Noch kein aktives Präparat"}
            </p>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border-subtle pt-5">
            <div>
              <dt className="text-xs text-text-muted">Aktive Präparate</dt>
              <dd className="mt-1 font-semibold text-text-primary">
                {activeCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Einnahmen · 7 Tage</dt>
              <dd className="mt-1 font-semibold text-text-primary">
                {sevenDayIntakeCount}
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </Link>
  );
}

export type DashboardAreaCard = {
  title: string;
  value: string;
  description: string;
  href: string;
  eyebrow: string;
};

export function DashboardAreaLink({ card }: { card: DashboardAreaCard }) {
  return (
    <Link
      href={card.href}
      className="group block rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-4"
    >
      <Card className="h-full overflow-hidden transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="h-1 bg-gradient-to-r from-forest-strong via-forest to-copper" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              {card.eyebrow}
            </p>
            <span className="text-sm font-semibold text-forest-strong">→</span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-text-primary">
            {card.title}
          </h2>
          <p className="mt-2 text-base font-semibold text-forest-strong">
            {card.value}
          </p>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {card.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
