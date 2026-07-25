-- CreateEnum
CREATE TYPE "SupplementForm" AS ENUM ('CAPSULE', 'TABLET', 'POWDER', 'LIQUID', 'DROPS', 'SPRAY', 'OTHER');

-- CreateEnum
CREATE TYPE "SupplementDoseUnit" AS ENUM ('CAPSULE', 'TABLET', 'GRAM', 'MILLIGRAM', 'MILLILITER', 'DROP', 'SCOOP', 'SPRAY');

-- CreateEnum
CREATE TYPE "SupplementIngredientUnit" AS ENUM ('GRAM', 'MILLIGRAM', 'MICROGRAM', 'INTERNATIONAL_UNIT');

-- CreateEnum
CREATE TYPE "SupplementReason" AS ENUM ('GENERAL_WELLBEING', 'DEFICIENCY', 'LAB_SUPPORT', 'IMMUNE_SUPPORT', 'DIGESTION', 'SLEEP', 'ENERGY', 'TRAINING', 'OTHER');

-- CreateEnum
CREATE TYPE "SupplementTolerance" AS ENUM ('NOT_RATED', 'WELL_TOLERATED', 'NEUTRAL', 'POSSIBLE_REACTION');

-- CreateEnum
CREATE TYPE "SupplementEffect" AS ENUM ('NOT_RATED', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'UNCLEAR');

-- CreateTable
CREATE TABLE "Supplement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "form" "SupplementForm" NOT NULL,
    "defaultDose" DECIMAL(8,2) NOT NULL,
    "doseUnit" "SupplementDoseUnit" NOT NULL,
    "reason" "SupplementReason" NOT NULL,
    "notes" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplementIngredient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,3),
    "elementalAmount" DECIMAL(10,3),
    "unit" "SupplementIngredientUnit",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplementIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplementIntake" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supplementId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "dose" DECIMAL(8,2) NOT NULL,
    "doseUnit" "SupplementDoseUnit" NOT NULL,
    "tolerance" "SupplementTolerance" NOT NULL DEFAULT 'NOT_RATED',
    "effect" "SupplementEffect" NOT NULL DEFAULT 'NOT_RATED',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplementIntake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Supplement_userId_archivedAt_name_idx" ON "Supplement"("userId", "archivedAt", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplement_userId_name_key" ON "Supplement"("userId", "name");

-- CreateIndex
CREATE INDEX "SupplementIngredient_userId_name_idx" ON "SupplementIngredient"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SupplementIngredient_supplementId_name_key" ON "SupplementIngredient"("supplementId", "name");

-- CreateIndex
CREATE INDEX "SupplementIntake_userId_takenAt_idx" ON "SupplementIntake"("userId", "takenAt");

-- CreateIndex
CREATE INDEX "SupplementIntake_supplementId_takenAt_idx" ON "SupplementIntake"("supplementId", "takenAt");

-- AddForeignKey
ALTER TABLE "Supplement" ADD CONSTRAINT "Supplement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementIngredient" ADD CONSTRAINT "SupplementIngredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementIngredient" ADD CONSTRAINT "SupplementIngredient_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementIntake" ADD CONSTRAINT "SupplementIntake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementIntake" ADD CONSTRAINT "SupplementIntake_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
