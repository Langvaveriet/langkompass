import { deleteLabReport } from "@/app/laborwerte/actions";

type LabReportDeletionProps = {
  reportId: string;
  resultCount: number;
};

export function LabReportDeletion({ reportId, resultCount }: LabReportDeletionProps) {
  return (
    <details className="mt-6 rounded-[var(--radius-xl)] border border-danger bg-surface-raised">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-danger marker:hidden">
        <span>Untersuchung löschen</span>
        <span aria-hidden="true">›</span>
      </summary>
      <form action={deleteLabReport} className="border-t border-danger p-5">
        <input type="hidden" name="labReportId" value={reportId} />
        <p className="text-sm leading-6 text-text-secondary">
          Dabei werden auch {resultCount} {resultCount === 1 ? "Laborwert" : "Laborwerte"} und vorhandene Korrekturstände dauerhaft gelöscht.
        </p>
        <label className="mt-4 flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border-strong p-3 text-sm font-semibold text-text-primary">
          <input type="checkbox" name="confirmDeletion" value="DELETE" required className="mt-1 size-5 accent-[var(--danger)]" />
          <span>Ja, diese gesamte Untersuchung endgültig löschen.</span>
        </label>
        <button type="submit" className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-md)] border border-danger bg-surface-raised px-5 py-3 text-sm font-semibold text-danger transition hover:bg-surface-muted sm:w-auto">
          Untersuchung endgültig löschen
        </button>
      </form>
    </details>
  );
}
