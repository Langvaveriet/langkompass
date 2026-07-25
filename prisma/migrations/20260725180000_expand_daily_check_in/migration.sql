-- AlterEnum
ALTER TYPE "MeasurementType" ADD VALUE 'WAIST_CIRCUMFERENCE';

-- AlterEnum
ALTER TYPE "MeasurementUnit" ADD VALUE 'CENTIMETER';

-- AlterTable
ALTER TABLE "DailyEntry"
ADD COLUMN "mood" INTEGER,
ADD COLUMN "hungerLevel" INTEGER,
ADD COLUMN "waterLiters" DECIMAL(5,2),
ADD COLUMN "steps" INTEGER,
ADD COLUMN "distanceKm" DECIMAL(7,2),
ADD COLUMN "activeMinutes" INTEGER;
