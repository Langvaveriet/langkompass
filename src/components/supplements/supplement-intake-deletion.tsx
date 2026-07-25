import { deleteSupplementIntake } from "@/app/supplemente/actions";

type SupplementIntakeDeletionProps = {
  intakeId: string;
  returnPeriod: string;
  returnSupplementId: string | null;
};

export function SupplementIntakeDeletion({ intakeId, returnPeriod, returnSupplementId }: SupplementIntakeDeletionProps) {
  return (
    <details className="mt-3 rounded-[var(--radius-md)] border border-danger bg-surface-raised">
      <summary className="flex min-h-11 cursor-pointer list-none items-center px-3 text-sm font-semibold text-danger marker:hidden">Einnahme löschen</summary>
      <form action={deleteSupplementIntake} className="border-t border-danger p-3">
        <input type="hidden" name="intakeId" value={intakeId} />
        <input type="hidden" name="returnPeriod" value={returnPeriod} />
        {returnSupplementId ? <input type="hidden" name="returnSupplementId" value={returnSupplementId} /> : null}
        <p className="text-sm leading-6 text-text-secondary">Diese Einnahme und ihre Korrekturstände werden dauerhaft gelöscht.</p>
        <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-text-primary">
          <input type="checkbox" name="confirmDeletion" value="DELETE" required className="size-5 accent-[var(--danger)]" />
          <span>Löschen bestätigen</span>
        </label>
        <button type="submit" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-danger">Einnahme endgültig löschen</button>
      </form>
    </details>
  );
}
