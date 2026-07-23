-- CreateEnum
CREATE TYPE "DailyEntryStatus" AS ENUM ('OPEN', 'MORNING_DONE', 'COMPLETED');

-- AlterTable
ALTER TABLE "DailyEntry" ADD COLUMN     "status" "DailyEntryStatus" NOT NULL DEFAULT 'OPEN';

-- Bestehende Tageserfassungen stammen aus dem bisherigen Einzelformular
-- und gelten mindestens als abgeschlossener Morgen-Check.
UPDATE "DailyEntry"
SET "status" = 'MORNING_DONE'
WHERE "status" = 'OPEN';
