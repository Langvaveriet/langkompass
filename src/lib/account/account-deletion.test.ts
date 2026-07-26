import assert from "node:assert/strict";
import test from "node:test";

import {
  accountDeletionConfirmation,
  isRecentAccountDeletionSession,
  parseAccountDeletionInput,
} from "./account-deletion";

function formData(confirmation: string, acknowledged = true) {
  const value = new FormData();
  value.set("confirmation", confirmation);
  if (acknowledged) value.set("acknowledged", "yes");
  return value;
}

test("akzeptiert nur die exakte Löschbestätigung mit Zustimmung", () => {
  assert.deepEqual(parseAccountDeletionInput(formData(accountDeletionConfirmation)), {
    confirmed: true,
    valid: true,
  });
  assert.equal(parseAccountDeletionInput(formData("löschen")).valid, false);
  assert.equal(parseAccountDeletionInput(formData(accountDeletionConfirmation, false)).valid, false);
});

test("leere und unvollständige Formulardaten lösen keine Löschung aus", () => {
  assert.deepEqual(parseAccountDeletionInput(new FormData()), {
    confirmed: false,
    valid: false,
  });
});

test("erfordert eine höchstens fünf Minuten alte Passkey-Sitzung", () => {
  const now = new Date("2026-07-26T12:05:00.000Z");

  assert.equal(
    isRecentAccountDeletionSession("2026-07-26T12:00:01.000Z", now),
    true,
  );
  assert.equal(
    isRecentAccountDeletionSession("2026-07-26T11:59:59.000Z", now),
    false,
  );
  assert.equal(isRecentAccountDeletionSession("ungültig", now), false);
});
