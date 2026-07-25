ALTER TABLE "Recipe"
ADD COLUMN "favoriteAt" TIMESTAMP(3);

-- Bereits sichtbare Katalogrezepte bleiben nach der Umstellung in der Bibliothek.
UPDATE "Recipe"
SET "favoriteAt" = "updatedAt"
WHERE "origin" = 'CURATED' AND "archivedAt" IS NULL;

CREATE INDEX "Recipe_userId_favoriteAt_updatedAt_idx"
ON "Recipe"("userId", "favoriteAt", "updatedAt");
