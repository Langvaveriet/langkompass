-- Existing meal times were entered as Europe/Stockholm wall-clock values but
-- stored as UTC. Normalize records created before the timezone-aware release.
UPDATE "Meal"
SET "consumedAt" =
  ("consumedAt" AT TIME ZONE 'Europe/Stockholm') AT TIME ZONE 'UTC'
WHERE "createdAt" < TIMESTAMP '2026-07-23 22:30:57.000';
