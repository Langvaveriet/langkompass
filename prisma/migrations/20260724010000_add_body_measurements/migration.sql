-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('WEIGHT');

-- CreateEnum
CREATE TYPE "MeasurementUnit" AS ENUM ('KILOGRAM');

-- CreateEnum
CREATE TYPE "EntrySource" AS ENUM ('MANUAL');

-- CreateTable
CREATE TABLE "BodyMeasurement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyEntryId" TEXT NOT NULL,
    "type" "MeasurementType" NOT NULL,
    "value" DECIMAL(8,2) NOT NULL,
    "unit" "MeasurementUnit" NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "source" "EntrySource" NOT NULL DEFAULT 'MANUAL',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BodyMeasurement_dailyEntryId_type_key" ON "BodyMeasurement"("dailyEntryId", "type");

-- CreateIndex
CREATE INDEX "BodyMeasurement_userId_type_measuredAt_idx" ON "BodyMeasurement"("userId", "type", "measuredAt");

-- AddForeignKey
ALTER TABLE "BodyMeasurement" ADD CONSTRAINT "BodyMeasurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyMeasurement" ADD CONSTRAINT "BodyMeasurement_dailyEntryId_fkey" FOREIGN KEY ("dailyEntryId") REFERENCES "DailyEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
